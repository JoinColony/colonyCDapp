import { SupportedCurrencies } from '~gql';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import {
  type CoinGeckoSupportedCurrencies,
  type TokenNamePriceSuccessResponse,
  type TokenNamePriceResponse,
} from './types.ts';
import { buildAPIEndpoint, fetchData, mapToAPIFormat } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

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
    [searchParams.api]: process.env.COINGECKO_API_KEY ?? '',
  });
};

const extractTokenPriceFromResponse = (
  data: TokenNamePriceSuccessResponse,
  tokenName: string,
  conversionDenomination: CoinGeckoSupportedCurrencies,
) => {
  try {
    return data[tokenName.toLowerCase()][
      mapToAPIFormat(currencies, conversionDenomination)
    ];
  } catch (e) {
    console.error(
      'Could not get token price from CoinGecko response. Response shape might have changed.',
      e,
    );
    return 0;
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

export const fetchTokenPriceByName = async ({
  tokenName,
  conversionDenomination = SupportedCurrencies.Usd,
}: {
  tokenName: string;
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  const url = buildTokenNameCoinGeckoURL(tokenName, conversionDenomination);

  const price = await fetchData<TokenNamePriceResponse, number>(
    url,
    (data) => {
      if (isTokenPriceSuccessResponse(data)) {
        return extractTokenPriceFromResponse(
          data,
          tokenName,
          conversionDenomination,
        );
      }

      console.error(
        `Unable to get price for ${tokenName}. It probably doesn't have a listed exchange value.`,
      );
      return 0;
    },
    `Api called failed at ${url}.`,
  );

  return price;
};
