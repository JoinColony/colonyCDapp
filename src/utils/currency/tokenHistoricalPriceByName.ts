import { format } from 'date-fns';

import { SupportedCurrencies } from '~gql';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import {
  type CoinGeckoSupportedCurrencies,
  type TokenNameHistoricalPriceResponse,
  type TokenNameHistoricalPriceSuccessResponse,
} from './types.ts';
import { buildAPIEndpoint, fetchData, mapToAPIFormat } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.
const getDateSearchParamValue = (date) => format(new Date(date), 'dd-MM-yyyy');

const { currencies } = coinGeckoMappings;
const buildHistoricalTokenNameCoinGeckoURL = (
  tokenName: string,
  date: string | Date,
) => {
  const { url, searchParams } =
    currencyApiConfig.endpoints.tokenHistoricalPriceByName;

  return buildAPIEndpoint(new URL(`${url}/${tokenName}/history`), {
    [searchParams.api]: import.meta.env.COINGECKO_API_KEY ?? '',
    [searchParams.date]: getDateSearchParamValue(date),
  });
};

const extractTokenPriceDataFromResponse = (
  data: TokenNameHistoricalPriceSuccessResponse,
  conversionDenomination: CoinGeckoSupportedCurrencies,
) => {
  try {
    const formattedConversionDenomination = mapToAPIFormat(
      currencies,
      conversionDenomination,
    );

    return (
      data.market_data?.current_price[formattedConversionDenomination] ?? 0
    );
  } catch (e) {
    console.error(
      'Could not get token price from CoinGecko response. Response shape might have changed.',
      e,
    );
    return 0;
  }
};

const isTokenPriceSuccessResponse = (
  data: TokenNameHistoricalPriceResponse,
): data is TokenNameHistoricalPriceSuccessResponse => {
  if (
    typeof data === 'undefined' ||
    data === null ||
    (typeof data === 'object' && Object.keys(data).length === 0)
  ) {
    return false;
  }

  return true;
};

export const fetchTokenHistoricalPriceByName = async ({
  tokenName,
  date,
  conversionDenomination = SupportedCurrencies.Usd,
}: {
  tokenName: string;
  date: string | Date;
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  const url = buildHistoricalTokenNameCoinGeckoURL(tokenName, date);

  const priceData = await fetchData<TokenNameHistoricalPriceResponse, number>(
    url,
    (data) => {
      if (isTokenPriceSuccessResponse(data)) {
        return extractTokenPriceDataFromResponse(data, conversionDenomination);
      }

      console.error(
        `Unable to get historical price for ${tokenName}. It probably doesn't have a listed exchange value.`,
      );
      return 0;
    },
    `Api called failed at ${url}.`,
  );

  return priceData;
};
