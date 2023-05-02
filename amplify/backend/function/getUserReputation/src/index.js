const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

let networkAddress;
try {
  const artifacts = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
  networkAddress = artifacts.etherRouterAddress;
} catch (error) {
  // silent error
  // means we're in a production environment without access to the contract build artifacts
}

const RPC_URL =
  process.env.CHAIN_RPC_ENDPOINT || 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const REPUTATION_ENDPOINT =
  process.env.REPUTATION_ENDPOINT || 'http://network-contracts:3002';
const NETWORK = process.env.CHAIN_RPC_ENDPOINT || Network.Custom;
const NETWORK_ADDRESS = process.env.CHAIN_NETWORK_CONTRACT || networkAddress;

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

  const networkClient = getColonyNetworkClient(NETWORK, provider, {
    networkAddress: NETWORK_ADDRESS,
    reputationOracleEndpoint: REPUTATION_ENDPOINT,
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
