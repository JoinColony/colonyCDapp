const EnvVarsConfig = require('./envVars.js');
const { coinGeckoMappings } = require('../consts.js');

const CoinGeckoConfig = (() => {
  const getCurrencyApiConfig = (apiUrl) => {
    return {
      endpoints: {
        coinList: {
          url: `${apiUrl}/api/v3/coins/list?include_platform=true`,
          searchParams: {
            api: 'x_cg_demo_api_key',
          },
        },
        tokenHistoricalPriceByAddress: {
          url: `${apiUrl}/api/v3/coins`,
          searchParams: {
            to: 'vs_currency',
            api: 'x_cg_demo_api_key',
            days: 'days',
            interval: 'interval',
          },
        },
        tokenHistoricalPriceByName: {
          url: `${apiUrl}/api/v3/coins`,
          searchParams: {
            api: 'x_cg_demo_api_key',
            date: 'date',
          },
        },
      },
    };
  };

  return {
    getConfig: async () => {
      const { coinGeckoApiUrl, coinGeckoApiKey } =
        await EnvVarsConfig.getEnvVars();

      return {
        mappings: coinGeckoMappings,
        api: getCurrencyApiConfig(coinGeckoApiUrl),
        apiKey: coinGeckoApiKey,
      };
    },
  };
})();

module.exports = CoinGeckoConfig;
