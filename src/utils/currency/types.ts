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
