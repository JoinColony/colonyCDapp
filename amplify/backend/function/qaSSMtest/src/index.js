require('cross-fetch/polyfill');
const { providers } = require('ethers');
const { getColonyNetworkClient } = require('@colony/colony-js');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let reputationOracleEndpoint;
let rpcURL;
let bnbRpcURL;
let network;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [
      apiKey,
      graphqlURL,
      reputationOracleEndpoint,
      networkAddress,
      rpcURL,
      bnbRpcURL,
      network,
    ] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'reputationEndpoint',
      'networkContractAddress',
      'chainRpcEndpoint',
      'bnbRpcEndpoint',
      'ethRpcEndpoint',
      'chainNetwork',
    ]);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async ({ walletAddress, colonyAddress }) => {
  await setEnvVariables();
  const provider = new providers.StaticJsonRpcProvider(rpcURL);

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
    disableVersionCheck: true,
  });
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(1);
  const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
    skillId,
    walletAddress,
  );
  console.log({
    apiKey,
    graphqlURL,
    reputationOracleEndpoint,
    reputationAmount,
    rpcURL,
    bnbRpcURL,
  });
  return null;
};
