import { Tokens } from '@colony/colony-js';

import { Network, SupportedCurrencies } from '~gql';

import { currencyApiConfig, coinGeckoMappings } from './config.ts';
import { getSavedPrice, savePrice } from './memo.ts';
import {
  CoinGeckoPriceRequestSuccessResponse,
  FetchCurrentPriceArgs,
  CoinGeckoSupportedCurrencies,
  SupportedChains,
  CoinGeckoPriceRequestResponse,
} from './types.ts';
import {
  buildAPIEndpoint,
  convertTokenToCLNY,
  fetchData,
  mapToAPIFormat,
} from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

const { chains, currencies } = coinGeckoMappings;

const buildCoinGeckoURL = (
  contractAddress: string,
  chainId: SupportedChains = Network.Gnosis,
  conversionDenomination: CoinGeckoSupportedCurrencies = SupportedCurrencies.Usd,
) => {
  const chain = mapToAPIFormat(chains, chainId);
  const denomination = mapToAPIFormat(currencies, conversionDenomination);

  return buildAPIEndpoint(new URL(`${currencyApiConfig.endpoint}${chain}`), {
    [currencyApiConfig.searchParams.from]: contractAddress,
    [currencyApiConfig.searchParams.to]: denomination,
    [currencyApiConfig.searchParams.api]: process.env.COINGECKO_API_KEY ?? '',
  });
};

const extractPriceFromCoinGeckoResponse = (
  data: CoinGeckoPriceRequestSuccessResponse,
  contractAddress: string,
  conversionDenomination: CoinGeckoSupportedCurrencies,
) => {
  try {
    return data[contractAddress.toLowerCase()][
      mapToAPIFormat(currencies, conversionDenomination)
    ];
  } catch (e) {
    console.error(
      'Could not get price from CoinGecko response. Response shape might have changed.',
      e,
    );
    return 0;
  }
};

const isCoinGeckoSuccessResponse = (
  data: CoinGeckoPriceRequestResponse,
): data is CoinGeckoPriceRequestSuccessResponse => {
  if (
    typeof data === 'undefined' || // undefined
    data == null || // null
    (typeof data == 'object' && Object.keys(data).length === 0) // empty object
  ) {
    return false;
  }

  return true;
};

const fetchPriceFromCoinGecko = async ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination = SupportedCurrencies.Usd,
}: Pick<FetchCurrentPriceArgs, 'chainId' | 'contractAddress'> & {
  conversionDenomination?: CoinGeckoSupportedCurrencies;
}) => {
  const url = buildCoinGeckoURL(
    contractAddress,
    chainId,
    conversionDenomination,
  );

  const price = await fetchData<CoinGeckoPriceRequestResponse, number>(
    url,
    (data) => {
      if (isCoinGeckoSuccessResponse(data)) {
        return extractPriceFromCoinGeckoResponse(
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

const getCLNYPriceInUSD = async () => {
  // Returns 1 CLNY in terms of USD, 1 CLNY : x USD
  return fetchPriceFromCoinGecko({
    contractAddress: Tokens.Mainnet.Mainnet,
    chainId: Network.Mainnet,
  });
};

/**
 * Fetch the current price of a given token in another token or fiat denomination.
 * @param contractAddress The contract address of the token to fetch the price of
 * @param chainId The chain ID of the token to fetch the price of
 * @param conversionDenomination The denomination to convert the price to
 * @returns The current price of the token in the given denomination, or null if api call fails
 */
export const fetchCurrentPrice = async ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination = SupportedCurrencies.Usd,
}: FetchCurrentPriceArgs): Promise<number | null> => {
  const savedPrice = getSavedPrice({
    contractAddress,
    chainId,
    currency: conversionDenomination,
  });

  if (typeof savedPrice !== 'undefined') {
    return savedPrice;
  }

  let result: number | null = 0;

  if (conversionDenomination === SupportedCurrencies.Clny) {
    const tokenPriceinUSD = await fetchPriceFromCoinGecko({
      contractAddress,
      chainId,
    });

    const clnyInUSD = await getCLNYPriceInUSD();
    if (clnyInUSD !== null && tokenPriceinUSD !== null) {
      result = convertTokenToCLNY(tokenPriceinUSD, clnyInUSD);
    }
  } else {
    result = await fetchPriceFromCoinGecko({
      contractAddress,
      chainId,
      conversionDenomination,
    });
  }

  if (result !== null) {
    savePrice({
      chainId,
      contractAddress,
      currency: conversionDenomination,
      price: result,
    });
  }

  return result;
};
