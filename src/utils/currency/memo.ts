import { type SupportedCurrencies } from '~gql';

import { type SupportedChains } from './types.ts';

export const savedPrices = new Map<
  SupportedChains,
  Map<SupportedCurrencies, Map<string, number>>
>();

export const getSavedPrice = ({
  chainId,
  contractAddress,
  currency,
}: {
  chainId: SupportedChains;
  contractAddress: string;
  currency: SupportedCurrencies;
}) => savedPrices.get(chainId)?.get(currency)?.get(contractAddress);

export const savePrice = ({
  chainId,
  contractAddress,
  currency,
  price,
}: {
  chainId: SupportedChains;
  contractAddress: string;
  currency: SupportedCurrencies;
  price: number;
}) => {
  const chainMap = savedPrices.get(chainId);
  if (chainMap) {
    const currencyMap = chainMap.get(currency);

    if (currencyMap) {
      currencyMap.set(contractAddress, price);
    } else {
      chainMap.set(
        currency,
        new Map<string, number>([[contractAddress, price]]),
      );
    }
  } else {
    savedPrices.set(
      chainId,
      new Map<SupportedCurrencies, Map<string, number>>([
        [currency, new Map<string, number>([[contractAddress, price]])],
      ]),
    );
  }
};
