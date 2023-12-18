import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { SetStateFn } from '~types';
import { SupportedCurrencies } from '~utils/currency/types';

interface CurrencyContextValues {
  currency: SupportedCurrencies;
  setCurrency: SetStateFn<SupportedCurrencies>;
}
const CurrencyContext = createContext<CurrencyContextValues | undefined>(
  undefined,
);

export const CurrencyContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currency, setCurrency] = useState(SupportedCurrencies.USD);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
    }),
    [currency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "CurrencyContext" provider',
    );
  }

  return ctx;
};
