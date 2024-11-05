const EnvVarsConfig = require('./envVars.js');

const {
  ColonyJSNetworkMapping,
  TOKEN_DATA,
  NETWORK_DATA,
} = require('../consts');

const NetworkConfig = (() => {
  return {
    getConfig: async () => {
      const { network } = await EnvVarsConfig.getEnvVars();
      const supportedNetwork = ColonyJSNetworkMapping[network];

      return {
        DEFAULT_NETWORK_TOKEN: TOKEN_DATA[supportedNetwork],
        DEFAULT_NETWORK_INFO: NETWORK_DATA[supportedNetwork],
      };
    },
  };
})();

module.exports = NetworkConfig;
