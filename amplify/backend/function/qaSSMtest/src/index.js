const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { providers } = require('ethers');

const { getColony, getColony2, getTokenByAddress } = require('./queries');
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
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
  const {
    id: colonyAddress,
    name,
    colonyNativeTokenId,
  } = event.arguments?.input || {};

  await setEnvVariables();

  const colonyQuery = await graphqlRequest(
    getColony2,
    { id: colonyAddress, name },
    graphqlURL,
    apiKey,
  );

  const tokenQuery = await graphqlRequest(
    getTokenByAddress,
    { id: colonyNativeTokenId },
    graphqlURL,
    apiKey,
  );

  console.log({ colonyQuery, tokenQuery });
  return null;
};
