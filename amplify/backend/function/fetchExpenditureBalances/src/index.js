const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

let rpcURL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
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
  setEnvVariables();

  const expenditure = event.source;

  const provider = new providers.JsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
  });
  const colonyClient = await networkClient.getColonyClient(
    expenditure.colonyId,
  );

  // Get all the token addresses that are used in the expenditure
  const tokenAddresses = expenditure.slots
    .map((slot) => slot.payouts?.map((payout) => payout.tokenAddress) ?? [])
    .flat();

  // Remove duplicates
  const uniqueTokenAddresses = [...new Set(tokenAddresses)];

  // Get the balances for each token address
  const balances = await Promise.all(
    uniqueTokenAddresses.map(async (tokenAddress) => {
      const tokenBalance = await colonyClient.getFundingPotBalance(
        expenditure.nativeFundingPotId,
        tokenAddress,
      );

      return {
        tokenAddress,
        amount: tokenBalance.toString(),
      };
    }),
  );

  return balances;
};
