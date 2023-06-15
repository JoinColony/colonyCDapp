const { getGraphQLURI } = require('./utils');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async () => {
  const uri = await getGraphQLURI();
  return uri;
};
