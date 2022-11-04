/* eslint-disable @typescript-eslint/no-var-requires */
const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { providers } = require('ethers');

const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const input = event?.arguments?.input;
  const colonyAddress = input?.colonyAddress;
  const walletAddress = input?.walletAddress;
  const domainId = input?.domainId;
  const rootHash = input?.rootHash;

  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
    // eslint-disable-next-line global-require
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint: 'http://localhost:3002/reputation',
  });
  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  const { skillId } = await colonyClient.getDomain(domainId ?? ROOT_DOMAIN_ID);

  const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
    skillId,
    walletAddress,
    rootHash,
  );

  return reputationAmount.toString();
};
