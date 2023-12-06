const { graphqlRequest } = require('./utils');
const {
  getCurrentVersion,
  updateCurrentVersion,
  createCurrentVersion,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'sc' || ENV === 'prod') {
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
    throw new Error('Unable to set env variables. Reason:', e);
  }

  const { key, version } = event.arguments?.input || {};

  const getCurrentVersionData = await graphqlRequest(
    getCurrentVersion,
    {
      key,
    },
    graphqlURL,
    apiKey,
  );

  const existingEntryId =
    getCurrentVersionData?.data?.getCurrentVersionByKey?.items?.[0]?.id;

  if (existingEntryId) {
    const updateCurrentVersionData = await graphqlRequest(
      updateCurrentVersion,
      {
        input: {
          id: existingEntryId,
          version,
        },
      },
      graphqlURL,
      apiKey,
    );

    return !!updateCurrentVersionData;
  }

  const createCurrentVersionData = await graphqlRequest(
    createCurrentVersion,
    {
      input: {
        key,
        version,
      },
    },
    graphqlURL,
    apiKey,
  );

  return !!createCurrentVersionData;
};
