import { createContext, useContext } from 'react';

import { type SupportedCurrencies } from '~gql';

interface BalanceCurrencyContextValues {
  currency: SupportedCurrencies;
  loading: boolean;
  convertAmount: (amount: string) => string;
}

export const BalanceCurrencyContext = createContext<
  BalanceCurrencyContextValues | undefined
>(undefined);

export const useBalanceCurrencyContext = () => {
  const ctx = useContext(BalanceCurrencyContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "BalanceCurrencyContext" provider',
    );
  }

  return ctx;
};
