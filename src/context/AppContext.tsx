import { utils } from 'ethers';
import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { ActionTypes } from '~redux/index.ts';
import { User } from '~types/graphql.ts';
import { ColonyWallet } from '~types/wallet.ts';
import { getLastWallet } from '~utils/autoLogin.ts';

import { getContext, ContextModule } from './index.ts';
import { TokenActivationProvider } from './TokenActivationContext.tsx';

export interface AppContextValues {
  wallet?: ColonyWallet | null;
  walletConnecting: boolean;
  setWalletConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User | null;
  userLoading: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  updateUser: (
    address: string | undefined,
    shouldBackgroundUpdate?: boolean,
  ) => Promise<void>;
  canInteract: boolean;
}

export const AppContext = createContext<AppContextValues | undefined>(
  undefined,
);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<AppContextValues['wallet']>();
  const [user, setUser] = useState<AppContextValues['user']>();
  const [userLoading, setUserLoading] = useState(false);
  // We need to start with true here as we can't know whethere we are going to try to connect
  // and the first render is important here
  const [walletConnecting, setWalletConnecting] = useState(true);

  const updateUser = useCallback(
    async (address: string | undefined, shouldBackgroundUpdate = false) => {
      if (address) {
        try {
          if (!shouldBackgroundUpdate) {
            setUserLoading(true);
          }
          const apolloClient = getContext(ContextModule.ApolloClient);
          const { data } = await apolloClient.query<
            GetUserByAddressQuery,
            GetUserByAddressQueryVariables
          >({
            query: GetUserByAddressDocument,
            variables: { address: utils.getAddress(address) },
            fetchPolicy: 'network-only',
          });
          const [currentUser] = data?.getUserByAddress?.items || [];
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setUserLoading(false);
        }
      }
    },
    [],
  );

  const updateWallet = useCallback(() => {
    try {
      const updatedWallet = getContext(ContextModule.Wallet);
      updatedWallet.address = utils.getAddress(updatedWallet.address);
      setWallet(updatedWallet);
      // Update the user as soon as the wallet address changes
      if (updatedWallet.address !== wallet?.address) {
        updateUser(updatedWallet.address);
      }
    } catch (error) {
      // It means that it was not set in context yet
    }
  }, [updateUser, wallet]);

  const setupUserContext = useAsyncFunction({
    submit: ActionTypes.WALLET_OPEN,
    error: ActionTypes.WALLET_OPEN_ERROR,
    success: ActionTypes.WALLET_OPEN_SUCCESS,
  });

  const userLogout = useAsyncFunction({
    submit: ActionTypes.USER_LOGOUT,
    error: ActionTypes.USER_LOGOUT_ERROR,
    success: ActionTypes.USER_LOGOUT_SUCCESS,
  });

  /*
   * Handle wallet connection
   */
  const connectWallet = useCallback(async () => {
    try {
      await setupUserContext(undefined);
      setWalletConnecting(true);
      updateWallet();
    } catch (error) {
      console.error('Could not connect wallet', error);
    } finally {
      setWalletConnecting(false);
    }
  }, [setupUserContext, updateWallet, setWalletConnecting]);

  /*
   * Handle wallet disconnection
   */
  const disconnectWallet = useCallback(async () => {
    try {
      await userLogout(undefined);
    } catch (error) {
      console.error('Could not disconnect wallet', error);
      return;
    }
    setWallet(null);
    setUser(null);
  }, [setWallet, setUser, userLogout]);

  /*
   * When the user switches account in Metamask, re-initiate the wallet connect flow
   * so as to update their wallet details in the app's memory.
   */
  const handleAccountChange = useCallback(() => {
    // @ts-ignore
    const loggedInAccount = window.ethereum?.selectedAddress;
    if (loggedInAccount) {
      connectWallet();
    }
  }, [connectWallet]);

  const previousAccountChange = usePrevious(handleAccountChange);

  useEffect(() => {
    if (window.ethereum) {
      if (previousAccountChange) {
        // @ts-ignore
        window.ethereum.removeListener(
          'accountsChanged',
          previousAccountChange,
        );
      }
      // @ts-ignore
      window.ethereum.on('accountsChanged', handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        // @ts-ignore
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, [handleAccountChange, previousAccountChange]);

  useEffect(() => {
    if (getLastWallet()) {
      connectWallet();
    } else {
      setWalletConnecting(false);
    }

    // NOTE: We really want this to run exactly once (when the app starts)
    // connectWallet is dependent on the wallet itself, so this is to avoid an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appContext = useMemo<AppContextValues>(
    () => ({
      wallet,
      walletConnecting,
      setWalletConnecting,
      user,
      userLoading,
      connectWallet,
      disconnectWallet,
      updateUser,
      canInteract: !!wallet && !!user,
    }),
    [
      wallet,
      walletConnecting,
      setWalletConnecting,
      user,
      userLoading,
      connectWallet,
      disconnectWallet,
      updateUser,
    ],
  );

  return (
    <AppContext.Provider value={appContext}>
      <TokenActivationProvider>{children}</TokenActivationProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('This hook must be used within the "AppContext" provider');
  }

  return context;
};
