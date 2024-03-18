import { createContext, useContext } from 'react';

import { type SupportedCurrencies } from '~gql';
import { type SetStateFn } from '~types/index.ts';

interface CurrencyContextValues {
  currency: SupportedCurrencies;
  updatePreferredCurrency: SetStateFn<SupportedCurrencies>;
}

export const CurrencyContext = createContext<CurrencyContextValues | undefined>(
  undefined,
);

export const useCurrencyContext = () => {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "CurrencyContext" provider',
    );
  }

  return ctx;
};
