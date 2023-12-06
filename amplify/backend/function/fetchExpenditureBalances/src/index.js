const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
  BigNumber,
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'sc' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [rpcURL, networkAddress, network] = await getParams([
      'chainRpcEndpoint',
      'networkContractAddress',
      'chainNetwork',
    ]);
  } else {
    const {
      etherRouterAddress,
    } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    networkAddress = etherRouterAddress;
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  await setEnvVariables();

  const expenditure = event.source;

  const provider = new providers.JsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
  });
  const colonyClient = await networkClient.getColonyClient(
    expenditure.colonyId,
  );

  // Create a map between token addresses and payout amounts
  const tokenRequiredAmounts = new Map();
  expenditure.slots.forEach((slot) => {
    slot.payouts?.forEach(({ tokenAddress, amount }) => {
      const currentAmount = tokenRequiredAmounts.get(tokenAddress) ?? 0;
      tokenRequiredAmounts.set(
        tokenAddress,
        BigNumber.from(amount).add(currentAmount).toString(),
      );
    });
  });

  // Get the balances for each token address
  const balances = await Promise.all(
    [...tokenRequiredAmounts.entries()]
      .filter(([_, requiredAmount]) => BigNumber.from(requiredAmount).gt(0))
      .map(async ([tokenAddress, requiredAmount]) => {
        const tokenBalance = await colonyClient.getFundingPotBalance(
          expenditure.nativeFundingPotId,
          tokenAddress,
        );

        return {
          tokenAddress,
          amount: tokenBalance.toString(),
          requiredAmount,
        };
      }),
  );

  return balances;
};
