import { Network, SupportedCurrencies } from '~gql';

// For walkthrough, see: https://apiguide.coingecko.com/getting-started/10-min-tutorial-guide/1-get-data-by-id-or-address
export const currencyApiConfig = {
  endpoint: 'https://api.coingecko.com/api/v3/simple/token_price/',
  searchParams: {
    from: 'contract_addresses',
    to: 'vs_currencies',
  },
};
export const coinGeckoMappings = {
  // This is a map between our internal reference to a supported currency, and the reference the api uses.
  // For full list: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: {
    [SupportedCurrencies.Usd]: 'usd',
    [SupportedCurrencies.Jpy]: 'jpy',
    [SupportedCurrencies.Gbp]: 'gbp',
    [SupportedCurrencies.Eur]: 'eur',
    [SupportedCurrencies.Cad]: 'cad',
    [SupportedCurrencies.Krw]: 'krw',
    [SupportedCurrencies.Inr]: 'inr',
    [SupportedCurrencies.Brl]: 'brl',
    [SupportedCurrencies.Eth]: 'eth',
  },
  // For full list: https://api.coingecko.com/api/v3/asset_platforms
  chains: {
    [Network.Gnosis]: 'xdai',
    [Network.Mainnet]: 'ethereum',
  },
};
