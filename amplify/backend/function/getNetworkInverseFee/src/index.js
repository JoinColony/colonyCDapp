const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { providers } = require('ethers');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const provider = new providers.JsonRpcProvider(RPC_URL);

exports.handler = async () => {
  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
  });
  const networkInverseFee = await networkClient.getFeeInverse();
  return networkInverseFee.toString();
};
