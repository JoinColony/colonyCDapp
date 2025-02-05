const {
  providers,
  constants: { AddressZero },
  Contract,
} = require('ethers');
const EnvVarsConfig = require('../config/envVars');
const { getStartOfDayFor } = require('../utils');
const { DEFAULT_TOKEN_DECIMALS } = require('../consts');
const {
  getColonyVersion,
  getDomains,
  getAllColonyTokens,
  getAllProxyColonies,
} = require('../api/graphql/operations');
const ExchangeRatesService = require('./exchangeRates');
const { getTotalFiatAmountFor } = require('./tokens');
const { getTokensDatesMap } = require('./actions');
const NetworkConfig = require('../config/networkConfig');

const FIRST_COLONY_VERSION_WITH_PROXY_COLONIES = 18;

const hasProxyChainSupport = (version) =>
  version >= FIRST_COLONY_VERSION_WITH_PROXY_COLONIES;

// Helper function to fetch block timestamp in milliseconds
const getBlockTimestamp = async (provider, blockNumber) => {
  const block = await provider.getBlock(blockNumber);
  return block ? block.timestamp * 1000 : null; // convert to milliseconds
};

// Final check to compare left and right bounds for closest timestamp
const checkFinalBounds = async ({
  provider,
  left,
  right,
  targetTimestamp,
  closestBlock,
  minTimestampDiff,
}) => {
  const leftTimestamp = await getBlockTimestamp(provider, left);
  const rightTimestamp = await getBlockTimestamp(provider, right);

  if (
    leftTimestamp !== null &&
    Math.abs(leftTimestamp - targetTimestamp) < minTimestampDiff
  ) {
    closestBlock = left;
  }
  if (
    rightTimestamp !== null &&
    Math.abs(rightTimestamp - targetTimestamp) < minTimestampDiff
  ) {
    closestBlock = right;
  }

  return closestBlock;
};

// Finds the closest past block to a target date using binary search
const findClosestPastBlock = async ({
  targetDate,
  averageBlockTime,
  currentBlockNumber,
  provider,
}) => {
  if (!targetDate) {
    return currentBlockNumber;
  }
  const targetTimestamp = new Date(targetDate).getTime();

  // Step 1: Estimate initial block guess near target timestamp
  const currentBlockTimestamp = await getBlockTimestamp(
    provider,
    currentBlockNumber,
  );
  const timeDiffSeconds = (currentBlockTimestamp - targetTimestamp) / 1000;
  let estimatedBlock =
    currentBlockNumber - Math.floor(timeDiffSeconds / averageBlockTime);

  // Step 2: Set up binary search bounds
  let left = Math.max(0, estimatedBlock - 1000);
  let right = currentBlockNumber;
  let closestBlock = currentBlockNumber;
  let minTimestampDiff = Infinity;

  console.log(`Starting binary search between blocks ${left} and ${right}`);

  // Step 3: Perform binary search
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTimestamp = await getBlockTimestamp(provider, mid);

    if (midTimestamp === null) {
      // If the block is missing, skip it and adjust bounds
      right = mid - 1;
      continue;
    }

    const timestampDiff = Math.abs(midTimestamp - targetTimestamp);

    // Update closest block if current mid is closer
    if (timestampDiff < minTimestampDiff) {
      closestBlock = mid;
      minTimestampDiff = timestampDiff;
    }

    // Adjust search bounds
    if (midTimestamp < targetTimestamp) {
      left = mid + 1;
    } else if (midTimestamp > targetTimestamp) {
      right = mid - 1;
    } else {
      return mid; // Exact match found
    }
  }

  // Step 4: Final check between last two bounds to confirm closest timestamp
  return checkFinalBounds({
    provider,
    left,
    right,
    targetTimestamp,
    closestBlock,
    minTimestampDiff,
  });
};

const getColonyTokens = async (colonyAddress) => {
  const tokensData = await getAllColonyTokens(colonyAddress);
  return [...tokensData.map(({ token }) => token)];
};

const getFilteredTokensWithDefaults = (tokens, chainId) => {
  return [
    {
      id: AddressZero,
      decimals: DEFAULT_TOKEN_DECIMALS,
      chainMetadata: { chainId },
    },
    ...tokens.filter((token) => token.chainMetadata?.chainId === chainId),
  ];
};

const getClosestBlock = async (provider, averageBlockTime, targetDate) => {
  const currentBlockNumber = await provider.getBlockNumber();
  const closestBlockNumber = await findClosestPastBlock({
    targetDate,
    averageBlockTime,
    currentBlockNumber,
    provider,
  });

  console.log('Closest block to target date:', closestBlockNumber);
  return provider.getBlock(closestBlockNumber);
};

const fetchBalances = async ({
  tokens,
  colonyClient,
  nativeFundingPotId,
  closestBlock,
  colonyVersionSupportsProxies,
}) => {
  return Promise.all(
    tokens.map(async (token) => {
      let rewardsPotTotal;
      try {
        if (colonyVersionSupportsProxies) {
          rewardsPotTotal = await colonyClient.getFundingPotBalance(
            nativeFundingPotId,
            token.chainMetadata?.chainId,
            token.id,
            { blockTag: closestBlock.number },
          );
        } else {
          rewardsPotTotal = await colonyClient.getFundingPotBalance(
            nativeFundingPotId,
            token.id,
            { blockTag: closestBlock.number },
          );
        }
        return {
          amount: rewardsPotTotal,
          networkFee: 0,
          token,
          finalizedDate: getStartOfDayFor(
            new Date(closestBlock.timestamp * 1000).toISOString(),
          ),
        };
      } catch {
        console.warn(
          `Couldn't retrieve getFundingPotBalance for block ${closestBlock.number}`,
        );

        return {
          amount: 0,
          networkFee: 0,
          token,
          finalizedDate: getStartOfDayFor(
            new Date(closestBlock.timestamp * 1000).toISOString(),
          ),
        };
      }
    }),
  );
};

const getDomainBalances = async ({
  tokens,
  domains,
  domainId,
  colonyClient,
  closestBlock,
  colonyVersionSupportsProxies,
}) => {
  if (domainId) {
    const domain = domains.find((d) => d.id === domainId);
    return fetchBalances({
      tokens,
      colonyClient,
      nativeFundingPotId: domain?.nativeFundingPotId,
      closestBlock,
      colonyVersionSupportsProxies,
    });
  }

  const allDomainBalances = await Promise.all(
    domains.map((domain) =>
      fetchBalances({
        tokens,
        colonyClient,
        nativeFundingPotId: domain?.nativeFundingPotId,
        closestBlock,
        colonyVersionSupportsProxies,
      }),
    ),
  );
  return allDomainBalances.flat();
};

const getProxyColonyBalances = async ({
  colonyAddress,
  colonyTokens,
  domains,
  domainId,
  closestBlock,
  colonyClient,
  colonyVersionSupportsProxies,
}) => {
  const proxyColonies = await getAllProxyColonies(colonyAddress);
  const activeProxyColonies = proxyColonies.filter(
    (proxyColony) => proxyColony.isActive,
  );

  const proxyBalances = await Promise.all(
    activeProxyColonies.map(async (proxyColony) => {
      const proxyChainId = proxyColony.chainId;

      const proxyTokens = getFilteredTokensWithDefaults(
        colonyTokens,
        proxyChainId,
      );
      return getDomainBalances({
        tokens: proxyTokens,
        domainId,
        domains,
        colonyClient: colonyClient,
        closestBlock,
        colonyVersionSupportsProxies,
      });
    }),
  );

  return proxyBalances.flat();
};

const getNetworkTotalBalance = async ({
  colonyAddress,
  domainId,
  timeframePeriodEndDate,
  selectedCurrency,
}) => {
  const { DEFAULT_NETWORK_INFO, basicColonyAbi, basicUpdatedColonyAbi } =
    await NetworkConfig.getConfig();
  const averageBlockTime = DEFAULT_NETWORK_INFO.blockTime;
  const { rpcURL } = await EnvVarsConfig.getEnvVars();

  const colonyVersion = await getColonyVersion(colonyAddress);
  const colonyVersionSupportsProxies = hasProxyChainSupport(colonyVersion);

  const provider = new providers.StaticJsonRpcProvider(rpcURL);
  const lightColonyClient = new Contract(
    colonyAddress,
    colonyVersionSupportsProxies ? basicUpdatedColonyAbi : basicColonyAbi,
    provider,
  );

  const colonyTokens = await getColonyTokens(colonyAddress);
  const domains = await getDomains(colonyAddress);

  const mainChainTokens = getFilteredTokensWithDefaults(
    colonyTokens,
    DEFAULT_NETWORK_INFO.chainId,
  );

  const closestBlock = await getClosestBlock(
    provider,
    averageBlockTime,
    timeframePeriodEndDate,
  );

  const mainBalances = await getDomainBalances({
    domains,
    domainId,
    tokens: mainChainTokens,
    colonyClient: lightColonyClient,
    closestBlock,
    colonyVersionSupportsProxies,
  });

  let proxyBalances = [];
  if (colonyVersionSupportsProxies) {
    proxyBalances = await getProxyColonyBalances({
      colonyAddress,
      colonyTokens,
      domains,
      domainId,
      colonyClient: lightColonyClient,
      closestBlock,
      colonyVersionSupportsProxies,
    });
  }

  const balances = [...mainBalances, ...proxyBalances];

  const exchangeRates = await ExchangeRatesService.getExchangeRates(
    getTokensDatesMap(balances),
    selectedCurrency,
  );

  return getTotalFiatAmountFor(balances, exchangeRates);
};

module.exports = {
  getNetworkTotalBalance,
};
