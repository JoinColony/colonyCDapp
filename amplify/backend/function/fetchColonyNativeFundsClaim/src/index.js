const { constants, providers, Contract } = require('ethers');
const basicColonyAbi = require('./basicColonyAbi.json');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

const provider = new providers.JsonRpcProvider(RPC_URL);

exports.handler = async ({ source: { id: colonyAddress } }) => {
  const { chainId } = await provider.getNetwork();
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
