const { getContributorAndMemberCount } = require('./utils');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { input: { colonyAddress } = {} } = event.arguments ?? {};

  if (!colonyAddress) {
    throw new Error(
      'Colony address not provided to getTotalMemberCount lambda',
    );
  }

  return getContributorAndMemberCount(colonyAddress);
};
