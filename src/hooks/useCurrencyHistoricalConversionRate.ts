import { useEffect, useState } from 'react';

import {
  type CoinGeckoSupportedCurrencies,
  coinGeckoMappings,
} from '~utils/currency/index.ts';
import { fetchTokenHistoricalPriceByName } from '~utils/currency/tokenHistoricalPriceByName.ts';

interface CurrencyConversionRateArgs {
  tokenSymbol: string;
  date: string | Date;
  conversionDenomination: CoinGeckoSupportedCurrencies;
}

export const useCurrencyHistoricalConversionRate = ({
  tokenSymbol,
  date,
  conversionDenomination,
}: CurrencyConversionRateArgs) => {
  const [conversionRate, setConversionRate] = useState<number | null>();
  const tokenName = coinGeckoMappings.networkTokens[tokenSymbol] ?? '';

  useEffect(() => {
    const getHistoricalPriceData = async () => {
      const historicalConversionRate = await fetchTokenHistoricalPriceByName({
        tokenName,
        date,
        conversionDenomination,
      });

      setConversionRate(historicalConversionRate);
    };

    if (tokenName) {
      getHistoricalPriceData();
    }
  }, [tokenName, date, conversionDenomination]);

  return conversionRate;
};
