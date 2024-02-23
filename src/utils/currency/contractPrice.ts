import { Network, SupportedCurrencies } from '~gql';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import {
  type FetchCurrentPriceArgs,
  type CoinGeckoSupportedCurrencies,
  type SupportedChains,
  type TokenContractPriceSuccessResponse,
  type TokenContractPriceResponse,
} from './types.ts';
import { buildAPIEndpoint, fetchData, mapToAPIFormat } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

const { chains, currencies } = coinGeckoMappings;
const buildTokenContractCoinGeckoURL = (
  contractAddress: string,
  chainId: SupportedChains = Network.Gnosis,
  conversionDenomination: CoinGeckoSupportedCurrencies = SupportedCurrencies.Usd,
) => {
  const chain = mapToAPIFormat(chains, chainId);
  const denomination = mapToAPIFormat(currencies, conversionDenomination);
  const { url, searchParams } =
    currencyApiConfig.endpoints.tokenPriceByContract;

  return buildAPIEndpoint(new URL(`${url}/${chain}`), {
    [searchParams.from]: contractAddress,
    [searchParams.to]: denomination,
    [searchParams.api]: process.env.COINGECKO_API_KEY ?? '',
  });
};

const extractContractPriceFromResponse = (
  data: TokenContractPriceSuccessResponse,
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

const isContractPriceSuccessResponse = (
  data: TokenContractPriceResponse,
): data is TokenContractPriceSuccessResponse => {
  if (
    typeof data === 'undefined' || // undefined
    data === null || // null
    (typeof data === 'object' && Object.keys(data).length === 0) // empty object
  ) {
    return false;
  }

  return true;
};

export const fetchContractPrice = async ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination = SupportedCurrencies.Usd,
}: Pick<FetchCurrentPriceArgs, 'chainId' | 'contractAddress'> & {
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  const url = buildTokenContractCoinGeckoURL(
    contractAddress,
    chainId,
    conversionDenomination,
  );

  const price = await fetchData<TokenContractPriceResponse, number>(
    url,
    (data) => {
      if (isContractPriceSuccessResponse(data)) {
        return extractContractPriceFromResponse(
          data,
          contractAddress,
          conversionDenomination,
        );
      }

      console.error(
        `Unable to get price for ${contractAddress}. It probably doesn't have a listed exchange value.`,
      );
      return 0;
    },
    `Api called failed at ${url}.`,
  );

  return price;
};
