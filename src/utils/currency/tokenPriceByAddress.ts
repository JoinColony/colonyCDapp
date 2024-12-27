import { SupportedCurrencies } from '~gql';
import { Network } from '~types/network.ts';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import {
  type FetchCurrentPriceArgs,
  type CoinGeckoSupportedCurrencies,
  type SupportedChains,
  type TokenAddressPriceSuccessResponse,
  type TokenAddressPriceResponse,
} from './types.ts';
import { buildAPIEndpoint, fetchJsonData, mapToAPIFormat } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

const { chains, currencies } = coinGeckoMappings;
const buildTokenAddressCoinGeckoURL = (
  contractAddress: string,
  chainId: SupportedChains = Network.ArbitrumOne,
  conversionDenomination: CoinGeckoSupportedCurrencies = SupportedCurrencies.Usd,
) => {
  const chain = mapToAPIFormat(chains, chainId);
  const denomination = mapToAPIFormat(currencies, conversionDenomination);
  const { url, searchParams } = currencyApiConfig.endpoints.tokenPriceByAddress;

  return buildAPIEndpoint(new URL(`${url}/${chain}`), {
    [searchParams.from]: contractAddress,
    [searchParams.to]: denomination,
    [searchParams.api]: import.meta.env.COINGECKO_API_KEY ?? '',
  });
};

const extractAddressPriceFromResponse = (
  data: TokenAddressPriceSuccessResponse,
  contractAddress: string,
  conversionDenomination: CoinGeckoSupportedCurrencies,
) => {
  try {
    return data[contractAddress.toLowerCase()][
      mapToAPIFormat(currencies, conversionDenomination)
    ];
  } catch (e) {
    console.error(
      'Could not get contract price from CoinGecko response. Response shape might have changed.',
      e,
    );
    return 0;
  }
};

const isAddressPriceSuccessResponse = (
  data: TokenAddressPriceResponse,
): data is TokenAddressPriceSuccessResponse => {
  if (
    typeof data === 'undefined' ||
    data === null ||
    (typeof data === 'object' && Object.keys(data).length === 0)
  ) {
    return false;
  }

  return true;
};

export const fetchTokenPriceByAddress = async ({
  contractAddress,
  chainId = Network.ArbitrumOne,
  conversionDenomination = SupportedCurrencies.Usd,
}: Pick<FetchCurrentPriceArgs, 'chainId' | 'contractAddress'> & {
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  try {
    const url = buildTokenAddressCoinGeckoURL(
      contractAddress,
      chainId,
      conversionDenomination,
    );

    return fetchJsonData<TokenAddressPriceResponse>(
      url,
      `Api called failed at ${url}.`,
    ).then((data) => {
      if (isAddressPriceSuccessResponse(data)) {
        return extractAddressPriceFromResponse(
          data,
          contractAddress,
          conversionDenomination,
        );
      }

      console.error(
        `Unable to get price for ${contractAddress}. It probably doesn't have a listed exchange value.`,
      );
      return 0;
    });
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(e);
    }
    return 0;
  }
};
