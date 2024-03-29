const { constants, providers, Contract } = require('ethers');
const basicColonyAbi = require('./basicColonyAbi.json');

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qaarbsep' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [rpcURL] = await getParams(['chainRpcEndpoint']);
  }
};

exports.handler = async ({ source: { id: colonyAddress } }) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const provider = new providers.StaticJsonRpcProvider(rpcURL);

  const providerNetwork = await provider.getNetwork();
  const chainId = String(providerNetwork.chainId);
  const block = await provider.getBlockNumber();
  const now = new Date();

  const lightColonyClient = new Contract(
    colonyAddress,
    basicColonyAbi,
    provider,
  );

  const balance = await provider.getBalance(colonyAddress);

  /*
   * Short circuit early, before making more expensive calls
   * If balance is 0, then no incoming transfers have been made
   */
  if (balance.gt(0)) {
    const colonyNonRewardsPotsTotal =
      await lightColonyClient.getNonRewardPotsTotal(constants.AddressZero);
    const colonyRewardsPotTotal = await lightColonyClient.getFundingPotBalance(
      /*
       * Root domain, since all initial transfers go in there
       */
      0,
      constants.AddressZero,
    );
    const unclaimedBalance = balance
      .sub(colonyNonRewardsPotsTotal)
      .sub(colonyRewardsPotTotal);

    if (unclaimedBalance.gt(0)) {
      return {
        __typeName: 'ColonyFundsClaim',
        amount: unclaimedBalance.toString(),
        id: `${chainId}_${constants.AddressZero}_0`,
        createdAt: now,
        updatedAt: now,
        createdAtBlock: block,
      };
    }
  }
  return null;
};
