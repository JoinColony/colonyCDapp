import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';

import { Wallet } from '~types';

import { getContext, ContextModule } from './index';

export const AppContext = createContext<{
  wallet?: Wallet;
  updateWallet?: () => void;
}>({});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  let initialWallet;

  try {
    initialWallet = getContext(ContextModule.Wallet);
  } catch (error) {
    // silent
    // It means that it was not set in context yet
  }

  const [wallet, setWallet] = useState(initialWallet);

  const updateWallet = useCallback((): void => {
    try {
      const updatedWallet = getContext(ContextModule.Wallet);
      setWallet(updatedWallet);
    } catch (error) {
      if (wallet) {
        // It means that the user logged out
        setWallet(undefined);
      }
      // It means that it was not set in context yet
    }
  }, [wallet]);

  const appContext = useMemo<{ wallet: Wallet; updateWallet: () => void }>(
    () => ({ wallet, updateWallet }),
    [updateWallet, wallet],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
