const EnvVarsConfig = require('./envVars.js');
const { SupportedNetwork } = require('../consts.js');

const {
  ColonyJSNetworkMapping,
  TOKEN_DATA,
  NETWORK_DATA,
} = require('../consts');

const basicColonyAbi = require('./basicColonyAbi.json');
const basicUpdatedColonyAbi = require('./basicUpdatedColonyAbi.json');

const DEFAULT_NETWORK = SupportedNetwork.ArbitrumOne;

const NetworkConfig = (() => {
  return {
    getNetworkConfigByChainId: (chainId) => {
      const network = Object.values(NETWORK_DATA).find(
        (network) => network.chainId === chainId,
      );

      if (!network) {
        console.error(`Network config not found for chain ID: ${chainId}`);
        return null;
      }

      return network;
    },
    getConfig: async () => {
      const { network } = await EnvVarsConfig.getEnvVars();
      const resolvedNetwork = ColonyJSNetworkMapping[network] || network;

      const DEFAULT_NETWORK_TOKEN =
        TOKEN_DATA[resolvedNetwork] || TOKEN_DATA[DEFAULT_NETWORK];
      const DEFAULT_NETWORK_INFO =
        NETWORK_DATA[resolvedNetwork] || NETWORK_DATA[DEFAULT_NETWORK];

      return {
        DEFAULT_NETWORK_TOKEN,
        DEFAULT_NETWORK_INFO,
        supportedNetwork: resolvedNetwork || DEFAULT_NETWORK,
        basicColonyAbi,
        basicUpdatedColonyAbi,
      };
    },
  };
})();

module.exports = NetworkConfig;
