import fromUnixTime from 'date-fns/fromUnixTime';

import { SupportedCurrencies } from '~gql';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import {
  type CoinGeckoSupportedCurrencies,
  type TokenNamePriceSuccessResponse,
  type TokenNamePriceResponse,
} from './types.ts';
import { buildAPIEndpoint, fetchJsonData, mapToAPIFormat } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

const fallbackResponseData = {
  conversionRate: 0,
  lastUpdatedAt: new Date(),
};

const { currencies } = coinGeckoMappings;
const buildTokenNameCoinGeckoURL = (
  tokenName: string,
  conversionDenomination: CoinGeckoSupportedCurrencies = SupportedCurrencies.Usd,
) => {
  const denomination = mapToAPIFormat(currencies, conversionDenomination);
  const { url, searchParams } = currencyApiConfig.endpoints.tokenPriceByName;

  return buildAPIEndpoint(new URL(`${url}/`), {
    [searchParams.from]: tokenName,
    [searchParams.to]: denomination,
    [searchParams.api]: import.meta.env.COINGECKO_API_KEY ?? '',
    [searchParams.includeLastUpdatedAt]: 'true',
  });
};

const extractTokenPriceDataFromResponse = (
  data: TokenNamePriceSuccessResponse,
  tokenName: string,
  conversionDenomination: CoinGeckoSupportedCurrencies,
) => {
  try {
    const tokenData = data[tokenName.toLowerCase()];
    const formattedConversionDenomination = mapToAPIFormat(
      currencies,
      conversionDenomination,
    );

    return {
      conversionRate: tokenData[formattedConversionDenomination],
      lastUpdatedAt: fromUnixTime(tokenData.last_updated_at),
    };
  } catch (e) {
    console.error(
      'Could not get token price from CoinGecko response. Response shape might have changed.',
      e,
    );
    return fallbackResponseData;
  }
};

const isTokenPriceSuccessResponse = (
  data: TokenNamePriceResponse,
): data is TokenNamePriceSuccessResponse => {
  if (
    typeof data === 'undefined' ||
    data === null ||
    (typeof data === 'object' && Object.keys(data).length === 0)
  ) {
    return false;
  }

  return true;
};

export const fetchTokenPriceDataByName = async ({
  tokenName,
  conversionDenomination = SupportedCurrencies.Usd,
}: {
  tokenName: string;
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  try {
    const url = buildTokenNameCoinGeckoURL(tokenName, conversionDenomination);

    return fetchJsonData<TokenNamePriceResponse>(
      url,
      `Api called failed at ${url}.`,
    ).then((data) => {
      if (isTokenPriceSuccessResponse(data)) {
        return extractTokenPriceDataFromResponse(
          data,
          tokenName,
          conversionDenomination,
        );
      }

      console.error(
        `Unable to get price for ${tokenName}. It probably doesn't have a listed exchange value.`,
      );
      return fallbackResponseData;
    });
  } catch (e) {
    if (!import.meta.env.DEV) {
      console.error(e);
    }
    return fallbackResponseData;
  }
};
