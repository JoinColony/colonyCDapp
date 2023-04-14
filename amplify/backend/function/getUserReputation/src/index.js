const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
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
  const input = event.arguments?.input;
  const colonyAddress = input?.colonyAddress;
  const walletAddress = input?.walletAddress;
  const domainId = input?.domainId;
  const rootHash = input?.rootHash;

  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint:
      'http://reputation-monitor.docker:3001/reputation/local',
  });
  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  const { skillId } = await colonyClient.getDomain(domainId ?? Id.RootDomain);

  try {
    const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
      skillId,
      walletAddress,
      rootHash,
    );

    return reputationAmount.toString();
  } catch (error) {
    return null;
  }
};
