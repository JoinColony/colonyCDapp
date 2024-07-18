const { kycLinksHandler } = require('./handlers/kycLinks');
const { putCustomerHandler } = require('./handlers/putCustomer');
const { checkKYCHandler } = require('./handlers/checkKyc');
const {
  createExternalAccountHandler,
} = require('./handlers/createExternalAccount');
const { env } = require('$amplify/env/bridgeXYZMutation');
const { secrets } = require('@aws-amplify/backend');
const { sdk } = require('aws-sdk');

const isDev = process.env.ENV === 'dev';

let graphqlURL = 'http://localhost:20002/graphql';
let appSyncApiKey = 'da2-fakeApiId123456';
let apiUrl = 'https://api.bridge.xyz';
let apiKey = 'xxx';

const setEnvVariables = async () => {
  if (!isDev) {
    // graphqlURL = env.graphqlURL;
    // appSyncApiKey = env.appsyncApiKey;
    // apiUrl = env.bridgeXYZApiUrl;
    // apiKey =

    const { getParams } = require('/opt/nodejs/getParams');
    [appSyncApiKey, apiKey, apiUrl, graphqlURL] = await getParams([
      'appsyncApiKey',
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
    ]);
  }
};

exports.handler = async (event) => {
  console.log({ env });
  console.log('Secret test:', secret('TEST_SECRET'));

  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: [`%2Famplify%2Fcdapp%2F${ENV}%2Fbridgexyz_api_url`].map(
        (secretName) => process.env[secretName],
      ),
      WithDecryption: true,
    })
    .promise();

  console.log({ Parameters });

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { path } = event.arguments?.input || {};

  const handlers = {
    'v0/kyc_links': kycLinksHandler,
    'v0/customers/{customerID}': putCustomerHandler,
    'v0/kyc_links/{kycLinkID}': checkKYCHandler,
    'v0/customers/{customerID}/external_accounts': createExternalAccountHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler = handlers[path] || handlers.default;

  return handler(event, { appSyncApiKey, apiKey, apiUrl, graphqlURL });
};
