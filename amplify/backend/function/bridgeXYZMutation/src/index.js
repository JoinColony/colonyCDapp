const { kycLinksHandler } = require('./handlers/kycLinks');
const { checkKYCHandler } = require('./handlers/checkKyc');
const {
  createExternalAccountHandler,
} = require('./handlers/createExternalAccount');
const {
  updateExternalAccountHandler,
} = require('./handlers/updateExternalAccount');
const { getDrainsHistoryHandler } = require('./handlers/getDrainsHistory');
const { getGatewayFeeHandler } = require('./handlers/getGatewayFee.js');
const {
  getUserLiquidationAddressHandler,
} = require('./handlers/getUserLiquidationAddress');

const isDev = process.env.ENV === 'dev';

let graphqlURL = 'http://localhost:20002/graphql';
let appSyncApiKey = 'da2-fakeApiId123456';
let apiUrl = process.env.BRIDGE_API_URL;
let apiKey = process.env.BRIDGE_API_KEY;
let temp_liquidationAddressOverrides =
  process.env.LIQUIDATION_ADDRESS_OVERRIDES;

const setEnvVariables = async () => {
  if (!isDev) {
    const { getParams } = require('/opt/nodejs/getParams');
    [
      appSyncApiKey,
      apiKey,
      apiUrl,
      graphqlURL,
      temp_liquidationAddressOverrides,
    ] = await getParams([
      'appsyncApiKey',
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
      'liquidationAddressOverrides',
    ]);
  }
};

const BRIDGE_OPERATIONS = {
  GET_DRAINS_HISTORY: 'bridgeGetDrainsHistory',
  CHECK_KYC: 'bridgeCheckKYC',
  GET_USER_LIQUIDATION_ADDRESS: 'bridgeGetUserLiquidationAddress',
  CREATE_EXTERNAL_ACCOUNT: 'bridgeCreateBankAccount',
  UPDATE_EXTERNAL_ACCOUNT: 'bridgeUpdateBankAccount',
  GET_GATEWAY_FEE: 'bridgeGetGatewayFee',
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
    [BRIDGE_OPERATIONS.GET_GATEWAY_FEE]: getGatewayFeeHandler,
    'v0/kyc_links': kycLinksHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler =
    handlers[path] || handlers[event.fieldName] || handlers.default;

  try {
    return await handler(event, {
      appSyncApiKey,
      apiKey,
      apiUrl,
      graphqlURL,
      temp_liquidationAddressOverrides,
    });
  } catch (error) {
    console.error(
      `bridgeXYZMutation handler ${handler.name} failed with error: ${error}`,
    );
    return { success: false };
  }
};
