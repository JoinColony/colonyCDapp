const EnvVarsConfig = require('./envVars.js');
const { SupportedNetwork } = require('../consts.js');

const {
  ColonyJSNetworkMapping,
  TOKEN_DATA,
  NETWORK_DATA,
} = require('../consts');

const NetworkConfig = (() => {
  return {
    getConfig: async () => {
      const { network } = await EnvVarsConfig.getEnvVars();
      const supportedNetwork = ColonyJSNetworkMapping[network] || network;

      return {
        DEFAULT_NETWORK_TOKEN:
          TOKEN_DATA[supportedNetwork] ?? TOKEN_DATA[SupportedNetwork.Ganache],
        DEFAULT_NETWORK_INFO:
          NETWORK_DATA[supportedNetwork] ??
          NETWORK_DATA[SupportedNetwork.Ganache],
      };
    },
  };
})();

module.exports = NetworkConfig;
