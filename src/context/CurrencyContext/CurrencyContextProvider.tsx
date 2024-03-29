import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SupportedCurrencies, useUpdateUserProfileMutation } from '~gql';
import { getUserCurrencyByLocation } from '~utils/currency/index.ts';

import { useAppContext } from '../AppContext/AppContext.ts';

import { CurrencyContext } from './CurrencyContext.ts';

const CurrencyContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const [currency, setCurrency] = useState(SupportedCurrencies.Usd);
  const [updateProfile] = useUpdateUserProfileMutation();

  const STORED_CURRENCY_KEY = 'preferredCurrency';

  const updatePreferredCurrency = useCallback(
    async (newCurrency: SupportedCurrencies) => {
      setCurrency(newCurrency);
      localStorage.setItem(STORED_CURRENCY_KEY, JSON.stringify(newCurrency));

      if (!user?.walletAddress) {
        return;
      }

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
      const storedCurrency = localStorage.getItem(STORED_CURRENCY_KEY);
      if (storedCurrency !== null) {
        updatePreferredCurrency(
          JSON.parse(storedCurrency) as SupportedCurrencies,
        );
      } else {
        const defaultCurrency = await getUserCurrencyByLocation();
        updatePreferredCurrency(defaultCurrency);
      }
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

export default CurrencyContextProvider;
