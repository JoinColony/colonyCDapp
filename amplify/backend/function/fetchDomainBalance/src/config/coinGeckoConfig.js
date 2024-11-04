const { Network: ColonyJSNetwork } = require('@colony/colony-js');
const EnvVarsConfig = require('./envVars.js');

const SupportedNetwork = {
  Mainnet: 'mainnet',
  Goerli: 'goerli',
  Gnosis: 'gnosis',
  GnosisFork: 'gnosisFork',
  Ganache: 'ganache',
  Polygon: 'polygon',
  Amoy: 'amoy',
  ArbitrumOne: 'arbitrumOne',
  ArbitrumSepolia: 'arbitrumSepolia',
};

const ColonyJSNetworkMapping = {
  [ColonyJSNetwork.Mainnet]: SupportedNetwork.Mainnet,
  [ColonyJSNetwork.Goerli]: SupportedNetwork.Goerli,
  [ColonyJSNetwork.Xdai]: SupportedNetwork.Gnosis,
  [ColonyJSNetwork.XdaiQa]: SupportedNetwork.GnosisFork,
  [ColonyJSNetwork.Custom]: SupportedNetwork.Ganache,
  [ColonyJSNetwork.ArbitrumOne]: SupportedNetwork.ArbitrumOne,
  [ColonyJSNetwork.ArbitrumSepolia]: SupportedNetwork.ArbitrumSepolia,
};

// import from amplify backend schema.graphql
const SupportedCurrencies = {
  USD: 'USD',
  JPY: 'JPY',
  GBP: 'GBP',
  EUR: 'EUR',
  CAD: 'CAD',
  KRW: 'KRW',
  INR: 'INR',
  BRL: 'BRL',
  ETH: 'ETH',
  CLNY: 'CLNY',
};

const XDAI_TOKEN = {
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  name: 'xDAI Token', //
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  symbol: 'xDAI',
  decimals: 18,
};

const ETHER_TOKEN = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const GOERLI_TOKEN = {
  name: 'Goerli Ether',
  symbol: 'GOETH',
  decimals: 18,
};

const POLYGON_TOKEN = {
  name: 'Matic Token',
  symbol: 'MATIC',
  decimals: 18,
};

const TOKEN_DATA = {
  [SupportedNetwork.Ganache]: ETHER_TOKEN,
  [SupportedNetwork.Gnosis]: XDAI_TOKEN,
  [SupportedNetwork.GnosisFork]: XDAI_TOKEN,
  [SupportedNetwork.Goerli]: GOERLI_TOKEN,
  [SupportedNetwork.Mainnet]: ETHER_TOKEN,
  [SupportedNetwork.Polygon]: POLYGON_TOKEN,
  [SupportedNetwork.Amoy]: POLYGON_TOKEN,
  [SupportedNetwork.ArbitrumOne]: ETHER_TOKEN,
  [SupportedNetwork.ArbitrumSepolia]: ETHER_TOKEN,
};

const coinGeckoMappings = {
  // This is a map between our internal reference to a supported currency, and the reference the api uses.
  // For full list: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: {
    [SupportedCurrencies.USD]: 'usd',
    [SupportedCurrencies.JPY]: 'jpy',
    [SupportedCurrencies.GBP]: 'gbp',
    [SupportedCurrencies.EUR]: 'eur',
    [SupportedCurrencies.CAD]: 'cad',
    [SupportedCurrencies.KRW]: 'krw',
    [SupportedCurrencies.INR]: 'inr',
    [SupportedCurrencies.BRL]: 'brl',
    [SupportedCurrencies.ETH]: 'eth',
  },
  chains: {
    [SupportedNetwork.Amoy]: 'polygon-pos',
    [SupportedNetwork.ArbitrumOne]: 'arbitrum-one',
    [SupportedNetwork.ArbitrumSepolia]: 'arbitrum-one',
    [SupportedNetwork.Ganache]: 'arbitrum-one',
    [SupportedNetwork.Gnosis]: 'xdai',
    [SupportedNetwork.GnosisFork]: 'xdai',
    [SupportedNetwork.Goerli]: 'ethereum',
    [SupportedNetwork.Mainnet]: 'ethereum',
    [SupportedNetwork.Polygon]: 'polygon-pos',
  },
  networkTokens: {
    [ETHER_TOKEN.symbol]: 'ethereum',
    [XDAI_TOKEN.symbol]: 'xdai',
  },
};

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
      const {
        network: colonyJSNetwork,
        coinGeckoApiUrl,
        coinGeckoApiKey,
      } = await EnvVarsConfig.getEnvVars();

      const network = ColonyJSNetworkMapping[colonyJSNetwork];

      return {
        DEFAULT_NETWORK_TOKEN: TOKEN_DATA[network],
        SupportedNetwork,
        SupportedCurrencies,
        mappings: coinGeckoMappings,
        api: getCurrencyApiConfig(coinGeckoApiUrl),
        apiKey: coinGeckoApiKey,
      };
    },
  };
})();

module.exports = CoinGeckoConfig;
