const { kycLinksHandler } = require('./handlers/kycLinks');
const { putCustomerHandler } = require('./handlers/putCustomer');
const { checkKYCHandler } = require('./handlers/checkKyc');
const {
  createExternalAccountHandler,
} = require('./handlers/createExternalAccount');

let graphqlURL = 'http://localhost:20002/graphql';
let appSyncApiKey = 'da2-fakeApiId123456';
let apiUrl = 'https://api.bridge.xyz';
let apiKey = 'xxx';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qaarbsep' || ENV === 'prod' || ENV === 'prodrevive') {
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
