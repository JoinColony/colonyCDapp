/**
 * This function performs upsert operation, meaning it will create
 * an extension if one matching the colony and hash doesn't exist,
 * provided all fields required by CreateColonyExtensionInput are specified
 */

const { graphqlRequest } = require('./utils');
const { getExtension, updateExtension, createExtension } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const {
    colonyId,
    hash,
    isDeprecated,
    isDeleted,
    isInitialized,
    version,
    installedAt,
    installedBy,
    extensionConfig,
  } = event.arguments?.input || {};

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

  // If extension record doesn't exist, try to create one
  if (!extension) {
    const createExtensionData = await graphqlRequest(
      createExtension,
      {
        input: {
          colonyId,
          hash,
          installedAt,
          installedBy,
          isDeleted,
          isDeprecated,
          isInitialized,
          version,
          extensionConfig,
        },
      },
      GRAPHQL_URI,
      API_KEY,
    );

    return createExtensionData?.data?.createColonyExtension;
  }

  // Otherwise, update the exising extension
  const updateExtensionData = await graphqlRequest(
    updateExtension,
    {
      input: {
        id: extension.id,
        isDeprecated,
        isDeleted,
        isInitialized,
        version,
        extensionConfig,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );
  return updateExtensionData?.data?.updateColonyExtension;
};
