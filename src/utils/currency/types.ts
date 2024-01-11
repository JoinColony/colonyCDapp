import { SupportedCurrencies } from '~gql';

import { coinGeckoMappings } from './config';

export type CoinGeckoSupportedCurrencies =
  keyof typeof coinGeckoMappings.currencies;

export type SupportedChains = keyof typeof coinGeckoMappings.chains;

export interface CoinGeckoPriceRequestSuccessResponse {
  [contractAddress: string]: {
    [currency: string]: number;
  };
}

export type CoinGeckoPriceRequestResponse =
  | CoinGeckoPriceRequestSuccessResponse
  // A contract address without a market cap will return an empty object {}
  | Record<string, never>;

export interface FetchCurrentPriceArgs {
  contractAddress: string;
  chainId?: SupportedChains;
  conversionDenomination?: SupportedCurrencies;
}

export interface IpifyResponse {
  ip: string;
}

export interface IpLocationResponse {
  ip: string; // IPv4 or IPv6 address used to lookup geolocation.
  ip_number: string; // IP number in long integer.
  ip_version: string; // IP version either 4 or 6.
  country_name: string; // Full name of the IP country.
  country_code2: string; // ISO ALPHA-2 Country Code.
  isp: string; // Internet Service Provider (ISP) who owns the IP address.
  response_code: string; // Response status code to indicate success or failed completion of the API call.
  response_message: string; // Response message to indicate success or failed completion of the API call.
}
