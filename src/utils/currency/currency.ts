import { Tokens } from '@colony/colony-js';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { Network, SupportedCurrencies } from '~gql';

import { coinGeckoMappings } from './config.ts';
import { fetchContractPrice } from './contractPrice.ts';
import { getSavedPrice, savePrice } from './memo.ts';
import { fetchTokenPrice } from './tokenPrice.ts';
import {
  type FetchCurrentPriceArgs,
  type CoinGeckoSupportedCurrencies,
} from './types.ts';
import { convertTokenToCLNY } from './utils.ts';

// The functions defined in this file assume something about the shape of the api response.
// If that changes, or if we change the api, these functions will need to be updated.

const fetchPriceFromCoinGecko = async ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination,
}: Pick<FetchCurrentPriceArgs, 'chainId' | 'contractAddress'> & {
  conversionDenomination: CoinGeckoSupportedCurrencies;
}) => {
  // If it's a network token we can't fetch it by contract address
  if (contractAddress === ADDRESS_ZERO) {
    const networkToken =
      coinGeckoMappings.networkTokens[DEFAULT_NETWORK_TOKEN.symbol];

    if (!networkToken) {
      console.error('Unable to get default network token.');
      return 0;
    }

    return fetchTokenPrice({
      tokenName: networkToken,
      conversionDenomination,
    });
  }

  return fetchContractPrice({
    contractAddress,
    chainId,
    conversionDenomination,
  });
};

const getCLNYPriceInUSD = async () => {
  // Returns 1 CLNY in terms of USD, 1 CLNY : x USD
  return fetchContractPrice({
    contractAddress: Tokens.Mainnet.Mainnet,
    chainId: Network.Mainnet,
    conversionDenomination: SupportedCurrencies.Usd,
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
      conversionDenomination: SupportedCurrencies.Usd,
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
