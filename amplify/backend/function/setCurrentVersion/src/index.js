const { graphqlRequest } = require('./utils');
const {
  getCurrentVersion,
  updateCurrentVersion,
  createCurrentVersion,
} = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { key, version } = event.arguments?.input || {};

  const getCurrentVersionData = await graphqlRequest(
    getCurrentVersion,
    {
      key,
    },
    GRAPHQL_URI,
    API_KEY,
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
      GRAPHQL_URI,
      API_KEY,
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
    GRAPHQL_URI,
    API_KEY,
  );

  return !!createCurrentVersionData;
};
