const { getParam } = require('getParam');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async () => {
  const graphqlUrl = await getParam('graphqlUrl');
  const reputationEndpoint = await getParam('reputationEndpoint');
  const chainNetworkContract = await getParam('chainNetworkContract');
  const chainRpcEndpoint = await getParam('chainRpcEndpoint');
  const chainNetwork = await getParam('chainNetwork');
 console.log({graphqlUrl, reputationEndpoint, chainNetworkContract, chainRpcEndpoint, chainNetwork})
  return null;
};
