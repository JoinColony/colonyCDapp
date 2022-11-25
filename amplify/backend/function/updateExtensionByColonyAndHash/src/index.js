const { graphqlRequest } = require('./utils');
const { getExtension, updateExtension } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { colonyId, hash, status, isDeprecated } = event.arguments?.input || {};

  const getExtensionData = await graphqlRequest(
    getExtension,
    {
      colonyId,
      hash,
    },
    GRAPHQL_URI,
    API_KEY,
  );

  const extension =
    getExtensionData?.data?.getExtensionByColonyAndHash?.items?.[0];

  if (!extension) {
    return null;
  }

  const updateExtensionData = await graphqlRequest(
    updateExtension,
    {
      input: {
        id: extension.id,
        status,
        isDeprecated,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  return updateExtensionData?.data?.updateColonyExtension;
};
