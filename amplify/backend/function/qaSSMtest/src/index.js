const { getParam } = require('/opt/nodejs/getParams');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async () => {
  const graphqlUrl = await getParam('graphqlUrl');
  const reputationEndpoint = await getParam('reputationEndpoint');
  const chainNetworkContract = await getParam('chainNetworkContract');
  const chainRpcEndpoint = await getParam('chainRpcEndpoint');
  const chainNetwork = await getParam('chainNetwork');
  const appSyncApi = await getParam('appSyncApi');

  console.log({
    graphqlUrl,
    reputationEndpoint,
    chainNetworkContract,
    chainRpcEndpoint,
    chainNetwork,
    appSyncApi,
  });
  return null;
};
