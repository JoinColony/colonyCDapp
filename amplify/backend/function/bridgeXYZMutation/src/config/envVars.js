const EnvVarsConfig = (() => {
  let graphqlURL = 'http://localhost:20002/graphql';
  let appSyncApiKey = 'da2-fakeApiId123456';
  let apiUrl = process.env.BRIDGE_API_URL;
  let apiKey = process.env.BRIDGE_API_KEY;
  let temp_liquidationAddressOverrides =
    process.env.LIQUIDATION_ADDRESS_OVERRIDES;
  let isInit = false;
  const isDev = process.env.ENV === 'dev';

  const setEnvVars = async () => {
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

  return {
    getEnvVars: async () => {
      if (!isInit) {
        try {
          await setEnvVars();
          isInit = true;
        } catch (e) {
          throw new Error('Unable to set environment variables. Reason:', e);
        }
      }

      return {
        appSyncApiKey,
        apiKey,
        apiUrl,
        graphqlURL,
        temp_liquidationAddressOverrides,
      };
    },
  };
})();

module.exports = EnvVarsConfig;
