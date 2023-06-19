const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { providers } = require('ethers');

const { getColony } = require('./queries');
const { graphqlRequest } = require('./utils');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
    const { getParams } = require('/opt/nodejs/getParams');
    [networkAddress, apiKey, graphqlURL, rpcURL, network] = await getParams([
      'chainNetworkContract',
      'appSyncApi',
      'graphqlUrl',
      'chainRpcEndpoint',
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

exports.handler = async ({ source: { id: colonyAddress } }) => {
  try {
    await setEnvVariables();
  } catch (e) {
    console.error(
      'Unable to set environment variables. Exiting lambda early. Reason:',
      e,
    );
    return {
      items: [],
    };
  }

  console.log({
    apiKey,
    graphqlURL,
    rpcURL,
    network,
    networkAddress,
  });

  const response = await graphqlRequest(
    getColony,
    { address: colonyAddress },
    graphqlURL,
    apiKey,
  );

  const { getColony: colony } = response?.data || {};

  if (!colony) {
    return { items: [] };
  }

  const provider = new providers.JsonRpcProvider(rpcURL);
  const networkClient = await getColonyNetworkClient(network, provider, {
    networkAddress,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  console.log({ response, colonyClient, networkClient });

  return {
    items: [],
  };
};
