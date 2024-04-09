const { graphqlRequest } = require('./utils');
const { createPrivateBetaInviteCode } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qaarbsep' || ENV === 'prodarbone') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { shareableInvites = 2 } = event.arguments?.input || {};

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const creation = await graphqlRequest(
    createPrivateBetaInviteCode,
    { shareableInvites },
    graphqlURL,
    apiKey,
  );

  if (creation.errors || !creation.data) {
    const [error] = creation.errors;
    throw new Error(error?.message || 'Could not create private beta invite');
  }

  const inviteCode = creation?.data?.createPrivateBetaInviteCode?.id;

  return inviteCode;
};
