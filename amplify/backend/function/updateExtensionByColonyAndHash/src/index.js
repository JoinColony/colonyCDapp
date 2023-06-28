/**
 * This function performs upsert operation, meaning it will create
 * an extension if one matching the colony and hash doesn't exist,
 * provided all fields required by CreateColonyExtensionInput are specified
 */

const { graphqlRequest } = require('./utils');
const { getExtension, updateExtension, createExtension } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

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
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason: ', e);
  }

  const {
    colonyId,
    hash,
    isDeprecated,
    isDeleted,
    isInitialized,
    version,
    installedAt,
    installedBy,
  } = event.arguments?.input || {};

  const getExtensionData = await graphqlRequest(
    getExtension,
    {
      colonyId,
      hash,
    },
    graphqlURL,
    apiKey,
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
        },
      },
      graphqlURL,
      apiKey,
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
      },
    },
    graphqlURL,
    apiKey,
  );

  return updateExtensionData?.data?.updateColonyExtension;
};
