const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  constants: { AddressZero },
} = require('ethers');
const EnvVarsConfig = require('../config/envVars');
const { getStartOfDayFor } = require('../utils');
const { DEFAULT_TOKEN_DECIMALS } = require('../consts');
const { getDomains, getAllColonyTokens } = require('../api/graphql/operations');
const ExchangeRatesService = require('./exchangeRates');
const { getTotalFiatAmountFor } = require('./tokens');
const { getTokensDatesMap } = require('./actions');
const NetworkConfig = require('../config/networkConfig');

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

const getTokensWithDefaults = async (colonyAddress) => {
  const tokensData = await getAllColonyTokens(colonyAddress);
  return [
    { id: AddressZero, decimals: DEFAULT_TOKEN_DECIMALS },
    ...tokensData.map(({ token }) => token),
  ];
};

const fetchBalances = async ({
  tokens,
  colonyClient,
  nativeFundingPotId,
  closestBlock,
}) => {
  return Promise.all(
    tokens.map(async (token) => {
      let rewardsPotTotal;
      try {
        rewardsPotTotal = await colonyClient.getFundingPotBalance(
          nativeFundingPotId,
          token.id,
          { blockTag: closestBlock.number },
        );
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

const getNetworkTotalBalance = async ({
  colonyAddress,
  domainId,
  timeframePeriodEndDate,
  selectedCurrency,
  chainId,
}) => {
  const { DEFAULT_NETWORK_INFO } = await NetworkConfig.getConfig();
  const averageBlockTime = DEFAULT_NETWORK_INFO.blockTime;
  const { network, networkAddress, rpcURL } = await EnvVarsConfig.getEnvVars();
  const provider = new providers.StaticJsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
  });

  const currentBlockNumber = await provider.getBlockNumber();
  const closestBlockNumber = await findClosestPastBlock({
    targetDate: timeframePeriodEndDate,
    averageBlockTime,
    currentBlockNumber,
    provider,
  });
  console.log('Closest block to target date:', closestBlockNumber);
  const closestBlock = await provider.getBlock(closestBlockNumber);

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const tokens = await getTokensWithDefaults(colonyAddress);

  const domains = await getDomains(colonyAddress);
  let balances = [];

  // If the "All teams" filter is selected, then domain will be undefined
  if (domainId) {
    const domain = domains.find((d) => d.id === domainId);
    balances = await fetchBalances({
      tokens,
      colonyClient,
      nativeFundingPotId: domain?.nativeFundingPotId,
      closestBlock,
    });
  } else {
    const allDomainsBalances = await Promise.all(
      domains.map(async (domain) =>
        fetchBalances({
          tokens,
          colonyClient,
          nativeFundingPotId: domain?.nativeFundingPotId,
          closestBlock,
        }),
      ),
    );

    balances = allDomainsBalances.flat();
  }

  const exchangeRates = await ExchangeRatesService.getExchangeRates(
    getTokensDatesMap(balances),
    selectedCurrency,
    chainId,
  );

  return getTotalFiatAmountFor(balances, exchangeRates);
};

module.exports = {
  getNetworkTotalBalance,
};
