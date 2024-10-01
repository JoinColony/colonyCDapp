import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { isDev } from '~constants';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { SupportedCurrencies } from '~gql';
import { convertFromTokenToClny } from '~utils/currency/convertFromTokenToClny.ts';
import { getCLNYPriceInUSD } from '~utils/currency/index.ts';

import { BalanceCurrencyContext } from './BalanceCurrencyContext.ts';

const BalanceCurrencyContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currency } = useCurrencyContext();
  const queryCurrency =
    currency === SupportedCurrencies.Clny ? SupportedCurrencies.Usd : currency;

  const defaultClnyInUSD = isDev ? 1 : 0;

  const [clnyInUSD, setClnyInUSD] = useState(defaultClnyInUSD);
  const [isClnyInUSDLoading, setIsClnyInUSDLoading] = useState(false);

  useEffect(() => {
    const fetchCLNYPriceInUSD = async () => {
      try {
        setIsClnyInUSDLoading(true);
        const result = await getCLNYPriceInUSD();
        setClnyInUSD(result ?? defaultClnyInUSD);
      } finally {
        setIsClnyInUSDLoading(false);
      }
    };

    if (currency === SupportedCurrencies.Clny) {
      fetchCLNYPriceInUSD();
    }
  }, [currency, defaultClnyInUSD]);

  const convertAmount = useCallback(
    (amount: string) => {
      if (currency === SupportedCurrencies.Clny) {
        return convertFromTokenToClny(amount, clnyInUSD);
      }

      return amount;
    },
    [clnyInUSD, currency],
  );

  const value = useMemo(
    () => ({
      currency: queryCurrency,
      convertAmount,
      loading: isClnyInUSDLoading,
    }),
    [queryCurrency, convertAmount, isClnyInUSDLoading],
  );

  return (
    <BalanceCurrencyContext.Provider value={value}>
      {children}
    </BalanceCurrencyContext.Provider>
  );
};

export default BalanceCurrencyContextProvider;
