const { getFeesHandler } = require('./handlers/getFees');
const { getDrainsHistoryHandler } = require('./handlers/getDrainsHistory');

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

const BRIDGE_QUERIES = {
  GET_DRAINS_HISTORY: 'bridgeGetDrainsHistory',
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
    [BRIDGE_QUERIES.GET_DRAINS_HISTORY]: getDrainsHistoryHandler,
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
    return null;
  }
};
