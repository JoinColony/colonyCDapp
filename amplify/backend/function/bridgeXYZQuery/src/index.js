const { getFeesHandler } = require('./handlers/getFees');
const { getLiquidationsHandler } = require('./handlers/getLiquidations');

const isDev = process.env.ENV === 'dev';

let appSyncApiKey = 'da2-fakeApiId123456';
let apiKey = 'da2-fakeApiId123456';
let apiUrl = 'http://mocking:3000/bridgexyz';
let graphqlURL = 'http://localhost:20002/graphql';

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

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { path } = event.arguments?.input || {};

  const handlers = {
    'v0/developer/fees': getFeesHandler,
    'v0/customers/{customerID}/liquidation_addresses/{liquidationAddressID}/drains':
      getLiquidationsHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler = handlers[path] || handlers.default;

  return handler(event, { appSyncApiKey, apiKey, apiUrl, graphqlURL });
};
