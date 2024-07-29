const { kycLinksHandler } = require('./handlers/kycLinks');
const { putCustomerHandler } = require('./handlers/putCustomer');
const { checkKYCHandler } = require('./handlers/checkKyc');
const {
  createExternalAccountHandler,
} = require('./handlers/createExternalAccount');
const {
  updateExternalAccountHandler,
} = require('./handlers/updateExternalAccount');

const isDev = process.env.ENV === 'dev';

let graphqlURL = 'http://localhost:20002/graphql';
let appSyncApiKey = 'da2-fakeApiId123456';
let apiUrl = 'https://api.sandbox.bridge.xyz';
let apiKey = 'xx';

const setEnvVariables = async () => {
  if (!isDev) {
    const { getParams } = require('/opt/nodejs/getParams');
    [appSyncApiKey, apiKey, apiUrl, graphqlURL] = await getParams([
      'appsyncApiKey',
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
    ]);
  }
};

const BRIDGE_MUTATIONS = {
  CREATE_EXTERNAL_ACCOUNT: 'bridgeCreateBankAccount',
  UPDATE_EXTERNAL_ACCOUNT: 'bridgeUpdateBankAccount',
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { path } = event.arguments?.input || {};

  const handlers = {
    [BRIDGE_MUTATIONS.CREATE_EXTERNAL_ACCOUNT]: createExternalAccountHandler,
    [BRIDGE_MUTATIONS.UPDATE_EXTERNAL_ACCOUNT]: updateExternalAccountHandler,
    'v0/kyc_links': kycLinksHandler,
    'v0/customers/{customerID}': putCustomerHandler,
    'v0/kyc_links/{kycLinkID}': checkKYCHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler =
    handlers[path] || handlers[event.fieldName] || handlers.default;

  try {
    return handler(event, { appSyncApiKey, apiKey, apiUrl, graphqlURL });
  } catch {
    return { success: false };
  }
};
