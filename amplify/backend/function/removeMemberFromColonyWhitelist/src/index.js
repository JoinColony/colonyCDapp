const { graphqlRequest } = require('./utils');
const { updateColony, getUser, getColony } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qaarbsep' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { colonyAddress, userAddress } = event.arguments?.input || {};

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const userExistenceCheckQuery = await graphqlRequest(
    getUser,
    { id: userAddress },
    graphqlURL,
    apiKey,
  );

  if (userExistenceCheckQuery.errors || !userExistenceCheckQuery.data) {
    const [error] = userExistenceCheckQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch user data from DynamoDB',
    );
  }

  const getColonyResponse = await graphqlRequest(
    getColony,
    { id: colonyAddress },
    graphqlURL,
    apiKey,
  );

  if (getColonyResponse.errors || !getColonyResponse.data) {
    const [error] = getColonyResponse.errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const { whitelist } = getColonyResponse?.data.getColony;

  if (!whitelist) {
    throw new Error('Colony whitelist not found');
  }

  if (!whitelist.includes(userAddress)) {
    throw new Error('Member is not whitelisted');
  }

  const updatedWhitelist = whitelist.filter(
    (whitelistedAddress) => whitelistedAddress !== userAddress,
  );

  const colonyMutation = await graphqlRequest(
    updateColony,
    {
      input: {
        id: colonyAddress,
        whitelist: updatedWhitelist,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMutation.errors || !colonyMutation.data) {
    const [error] = colonyMutation.errors;
    throw new Error(error?.message || 'Could not update colony whitelist');
  }

  return true;
};
