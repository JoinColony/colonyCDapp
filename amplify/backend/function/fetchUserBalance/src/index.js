const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
  });
  const tokenLockingClient = await networkClient.getTokenLockingClient();
  const userLock = await tokenLockingClient.getUserLock(
    tokenAddress,
    userAddress,
  );

  return 'hi';
};
