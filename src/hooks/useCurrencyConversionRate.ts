import { useEffect, useState } from 'react';

import {
  type CoinGeckoSupportedCurrencies,
  coinGeckoMappings,
} from '~utils/currency/index.ts';
import { fetchTokenPriceDataByName } from '~utils/currency/tokenPriceDataByName.ts';

interface CurrencyConversionRateArgs {
  tokenSymbol: string;
  conversionDenomination: CoinGeckoSupportedCurrencies;
}

interface CurrencyConversionRate {
  conversionRate?: number;
  lastUpdatedAt?: Date;
}

export const useCurrencyConversionRate = ({
  tokenSymbol,
  conversionDenomination,
}: CurrencyConversionRateArgs) => {
  const [currencyConversionRate, setCurrencyConversionRate] =
    useState<CurrencyConversionRate | null>();
  const tokenName = coinGeckoMappings.networkTokens[tokenSymbol];

  useEffect(() => {
    const getPriceData = async () => {
      const priceData = await fetchTokenPriceDataByName({
        tokenName,
        conversionDenomination,
      });

      setCurrencyConversionRate(priceData);
    };

    if (tokenName) {
      getPriceData();
    }
  }, [tokenName, conversionDenomination]);

  return currencyConversionRate;
};
