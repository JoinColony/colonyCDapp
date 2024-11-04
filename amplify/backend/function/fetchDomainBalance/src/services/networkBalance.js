const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  constants: { AddressZero },
} = require('ethers');
const EnvVarsConfig = require('../config/envVars');
const {
  getDifferenceInSeconds,
  DEFAULT_TOKEN_DECIMALS,
  getStartOfDayFor,
} = require('../utils');
const { getDomains, getAllColonyTokens } = require('../api/graphql/operations');
const ExchangeRatesService = require('./exchangeRates');
const { getTotalFiatAmountFor } = require('./tokens');
const { getTokensDatesMap } = require('./actions');

const getAverageBlockTime = async ({
  provider,
  currentBlockNumber,
  sampleSize,
}) => {
  const currentBlock = await provider.getBlock(currentBlockNumber);
  const previousBlock = await provider.getBlock(
    currentBlockNumber - sampleSize,
  );
  const timeDifference = currentBlock.timestamp - previousBlock.timestamp;
  return timeDifference / sampleSize;
};

const getEstimatedBlockNumber = async ({
  timeframeEndDate,
  currentBlockNumber,
  averageBlockTime,
}) => {
  const currentBlockTimestamp = new Date(
    currentBlockNumber * 1000,
  ).toISOString();
  const numberOfSecondsAgo = getDifferenceInSeconds(
    currentBlockTimestamp,
    timeframeEndDate,
  );
  const estimatedBlocksDifference = Math.floor(
    numberOfSecondsAgo / averageBlockTime,
  );

  // If estimatedBlocksDifference is negative, it means timeframePeriodEndDate is ahead of current network block time
  if (estimatedBlocksDifference < 0) {
    return currentBlockNumber;
  }
  // @TODO If estimatedBlocksDifference is higher than the existing number of blocks, we need to get the data for the (current or first)? block
  if (estimatedBlocksDifference > currentBlockNumber) {
    return currentBlockNumber;
  }

  return currentBlockNumber - estimatedBlocksDifference;
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
  estimatedBlockNumber,
}) => {
  return Promise.all(
    tokens.map(async (token) => {
      const rewardsPotTotal = await colonyClient.getFundingPotBalance(
        nativeFundingPotId,
        token.id,
        { blockTag: estimatedBlockNumber },
      );
      return {
        amount: rewardsPotTotal,
        networkFee: 0,
        token,
        finalizedDate: getStartOfDayFor(
          new Date(estimatedBlockNumber * 1000).toISOString(),
        ),
      };
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
  const { network, networkAddress, rpcURL } = await EnvVarsConfig.getEnvVars();
  const provider = new providers.StaticJsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
  });

  const currentBlockNumber = await provider.getBlockNumber();
  const averageBlockTime = await getAverageBlockTime({
    provider,
    currentBlockNumber,
    sampleSize: 1000,
  });
  const estimatedBlockNumber = await getEstimatedBlockNumber({
    provider,
    timeframePeriodEndDate,
    currentBlockNumber,
    averageBlockTime,
  });

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
      estimatedBlockNumber,
    });
  } else {
    const allDomainsBalances = await Promise.all(
      domains.map(async (domain) =>
        fetchBalances({
          tokens,
          colonyClient,
          nativeFundingPotId: domain?.nativeFundingPotId,
          estimatedBlockNumber,
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
