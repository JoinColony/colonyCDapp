import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SupportedCurrencies, useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { SetStateFn } from '~types';
import { getUserCurrencyByLocation } from '~utils/currency/location';

interface CurrencyContextValues {
  currency: SupportedCurrencies;
  updatePreferredCurrency: SetStateFn<SupportedCurrencies>;
}
const CurrencyContext = createContext<CurrencyContextValues | undefined>(
  undefined,
);

export const CurrencyContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAppContext();
  const [currency, setCurrency] = useState(SupportedCurrencies.Usd);
  const [updateProfile] = useUpdateUserProfileMutation();

  const updatePreferredCurrency = useCallback(
    async (newCurrency: SupportedCurrencies) => {
      if (!user?.walletAddress) {
        return;
      }

      setCurrency(newCurrency);
      await updateProfile({
        variables: {
          input: {
            id: user.walletAddress,
            preferredCurrency: newCurrency,
          },
        },
      });
    },
    [updateProfile, user?.walletAddress],
  );

  useEffect(() => {
    const setDefaultUserCurrency = async () => {
      const defaultCurrency = await getUserCurrencyByLocation();
      updatePreferredCurrency(defaultCurrency);
    };

    if (user?.profile?.preferredCurrency) {
      setCurrency(user?.profile?.preferredCurrency);
    } else {
      setDefaultUserCurrency();
    }
  }, [user?.profile?.preferredCurrency, updatePreferredCurrency]);

  const value = useMemo(
    () => ({
      currency,
      updatePreferredCurrency,
    }),
    [currency, updatePreferredCurrency],
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
