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
  /**
   * @Note This needs to be removed once we re-enable SupportedCurrencies.Clny
   */
  const isCLNYTokenStored =
    JSON.parse(localStorage.getItem(STORED_CURRENCY_KEY) || '{}') ===
    SupportedCurrencies.Clny;

  const updatePreferredCurrency = useCallback(
    async (newCurrency: SupportedCurrencies) => {
      /**
       * @Note This needs to be removed once we re-enable SupportedCurrencies.Clny
       */
      if (newCurrency === SupportedCurrencies.Clny) return;

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

  /**
   * @Note This can be moved in the previous
   * useEffect(() => {}, [user?.profile?.preferredCurrency, setDefaultUserCurrency])
   * once we re-enable SupportedCurrencies.Clny
   */
  const setDefaultUserCurrency = useCallback(async () => {
    const storedCurrency = localStorage.getItem(STORED_CURRENCY_KEY);
    const parsedStoredCurrency = storedCurrency
      ? JSON.parse(storedCurrency)
      : null;
    if (parsedStoredCurrency !== null) {
      updatePreferredCurrency(parsedStoredCurrency as SupportedCurrencies);
    } else {
      const defaultCurrency = await getUserCurrencyByLocation();
      updatePreferredCurrency(defaultCurrency);
    }
  }, [updatePreferredCurrency]);

  /**
   * @Note This needs to be removed once we re-enable SupportedCurrencies.Clny
   */
  useEffect(() => {
    if (isCLNYTokenStored) {
      localStorage.removeItem(STORED_CURRENCY_KEY);
      setDefaultUserCurrency();
    }
  }, [isCLNYTokenStored, setDefaultUserCurrency]);

  useEffect(() => {
    if (
      user?.profile?.preferredCurrency &&
      user?.profile?.preferredCurrency !== SupportedCurrencies.Clny
    ) {
      setCurrency(user?.profile?.preferredCurrency);
    } else {
      setDefaultUserCurrency();
    }
  }, [user?.profile?.preferredCurrency, setDefaultUserCurrency]);

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
