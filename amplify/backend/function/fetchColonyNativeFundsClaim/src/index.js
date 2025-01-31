const { constants, providers, Contract, BigNumber } = require('ethers');
const { graphqlRequest, getRpcUrlByChainId } = require('./utils');
const { getProxyColonies } = require('./graphql');
const basicColonyAbi = require('./basicColonyAbi.json');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

let mainRpcURL = 'http://network-contracts:8545';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, mainRpcURL] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'chainRpcEndpoint',
    ]);
  }
};

exports.handler = async ({ source: { id: colonyAddress } }) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  // Fetch proxy colony details
  const getProxyColoniesResponse = await graphqlRequest(
    getProxyColonies,
    { colonyAddress },
    graphqlURL,
    apiKey,
  );

  if (getProxyColoniesResponse.errors || !getProxyColoniesResponse.data) {
    const [error] = getProxyColoniesResponse.errors;
    throw new Error(
      error?.message || 'Could not fetch proxy colony data from DynamoDB',
    );
  }

  const { items: proxyColonies } =
    getProxyColoniesResponse?.data?.getProxyColoniesByColonyAddress;

  const activeProxyColonies = proxyColonies.filter(
    (proxyColony) => proxyColony.isActive,
  );

  // Handle main chain
  const provider = new providers.StaticJsonRpcProvider(mainRpcURL);

  const providerNetwork = await provider.getNetwork();
  const chainId = String(providerNetwork.chainId);
  const block = await provider.getBlockNumber();
  const now = new Date();

  const lightColonyClient = new Contract(
    colonyAddress,
    basicColonyAbi,
    provider,
  );

  let colonyFundsClaim = {
    __typeName: 'ColonyFundsClaim',
    amount: BigNumber.from(0).toString(),
    id: `${chainId}_${constants.AddressZero}_0`,
    createdAt: now,
    updatedAt: now,
    createdAtBlock: block,
  };

  const balanceOnMainChain = await provider.getBalance(colonyAddress);

  /*
   * Short circuit early, before making more expensive calls
   * If balance is 0, then no incoming transfers have been made
   */
  if (balanceOnMainChain.gt(0)) {
    const colonyNonRewardsPotsTotal =
      await lightColonyClient.getNonRewardPotsTotal(
        chainId,
        constants.AddressZero,
      );
    const colonyRewardsPotTotal = await lightColonyClient.getFundingPotBalance(
      /*
       * Root domain, since all initial transfers go in there
       */
      0,
      chainId,
      constants.AddressZero,
    );
    const unclaimedBalance = balanceOnMainChain
      .sub(colonyNonRewardsPotsTotal)
      .sub(colonyRewardsPotTotal);

    if (unclaimedBalance.gt(0)) {
      colonyFundsClaim = {
        ...colonyFundsClaim,
        amount: unclaimedBalance.toString(),
      };
    }
  }

  // Return early if no proxy colonies
  if (activeProxyColonies.length < 1) {
    // If the balance is 0, or unclaimed balance is 0, still return a claim with amount zero.
    // This is because we want to always show native chain tokens in the incoming funds table.
    return [colonyFundsClaim];
  }

  const proxyColonyClaims = await Promise.all(
    activeProxyColonies.map(async (proxyColony) => {
      const proxyChainId = proxyColony.chainId;
      const proxyRpcURL = getRpcUrlByChainId(proxyChainId);
      const proxyProvider = new providers.StaticJsonRpcProvider(proxyRpcURL);
      const proxyBlock = await proxyProvider.getBlockNumber();
      const proxyBalance = await proxyProvider.getBalance(colonyAddress);

      const proxyColonyFundsClaim = {
        __typeName: 'ColonyFundsClaim',
        amount: BigNumber.from(0).toString(),
        id: `${proxyChainId}_${constants.AddressZero}_0`,
        createdAt: now,
        updatedAt: now,
        createdAtBlock: proxyBlock,
      };

      if (proxyBalance.gt(0)) {
        const proxyColonyNonRewardsPotsTotal =
          await lightColonyClient.getNonRewardPotsTotal(
            proxyChainId,
            constants.AddressZero,
          );
        const proxyColonyRewardsPotTotal =
          await lightColonyClient.getFundingPotBalance(
            /*
             * Root domain, since all initial transfers go in there
             */
            0,
            proxyChainId,
            constants.AddressZero,
          );
        const unclaimedBalance = proxyBalance
          .sub(proxyColonyNonRewardsPotsTotal)
          .sub(proxyColonyRewardsPotTotal);

        if (unclaimedBalance.gt(0)) {
          return {
            ...proxyColonyFundsClaim,
            amount: unclaimedBalance.toString(),
          };
        }
      }

      // If the balance is 0, or unclaimed balance is 0, still return a claim with amount zero.
      // This is because we want to always show native chain tokens in the incoming funds table.
      return proxyColonyFundsClaim;
    }),
  );

  return [colonyFundsClaim].concat(proxyColonyClaims);
};
