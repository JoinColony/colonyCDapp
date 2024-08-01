const { kycLinksHandler } = require('./handlers/kycLinks');
const { checkKYCHandler } = require('./handlers/checkKyc/checkKyc');
const {
  createExternalAccountHandler,
} = require('./handlers/createExternalAccount');
const {
  updateExternalAccountHandler,
} = require('./handlers/updateExternalAccount');
const { getDrainsHistoryHandler } = require('./handlers/getDrainsHistory');
const {
  getUserLiquidationAddressHandler,
} = require('./handlers/getUserLiquidationAddress');

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

const BRIDGE_OPERATIONS = {
  GET_DRAINS_HISTORY: 'bridgeGetDrainsHistory',
  CHECK_KYC: 'bridgeCheckKYC',
  GET_USER_LIQUIDATION_ADDRESS: 'bridgeGetUserLiquidationAddress',
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
    [BRIDGE_OPERATIONS.CREATE_EXTERNAL_ACCOUNT]: createExternalAccountHandler,
    [BRIDGE_OPERATIONS.UPDATE_EXTERNAL_ACCOUNT]: updateExternalAccountHandler,
    [BRIDGE_OPERATIONS.GET_DRAINS_HISTORY]: getDrainsHistoryHandler,
    [BRIDGE_OPERATIONS.CHECK_KYC]: checkKYCHandler,
    [BRIDGE_OPERATIONS.GET_USER_LIQUIDATION_ADDRESS]:
      getUserLiquidationAddressHandler,
    'v0/kyc_links': kycLinksHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler =
    handlers[path] || handlers[event.fieldName] || handlers.default;

  try {
    return await handler(event, { appSyncApiKey, apiKey, apiUrl, graphqlURL });
  } catch (error) {
    console.error(
      `bridgeXYZMutation handler ${handler.name} failed with error: ${error}`,
    );
    return { success: false };
  }
};
