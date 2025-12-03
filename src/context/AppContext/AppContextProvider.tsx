import { utils } from 'ethers';
import React, {
  useState,
  useMemo,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';

import { useGetCurrentUserLazyQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useJoinedColonies from '~hooks/useJoinedColonies.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { ActionTypes } from '~redux/index.ts';
import { getLastWallet } from '~utils/autoLogin.ts';

import { getContext, ContextModule } from '../index.ts';
import { TokenActivationProvider } from '../TokenActivationContext/TokenActivationContextProvider.tsx';

import { AppContext, type AppContextValue } from './AppContext.ts';

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<AppContextValue['wallet']>();
  const [user, setUser] = useState<AppContextValue['user']>();
  const [userLoading, setUserLoading] = useState(false);
  // We need to start with true here as we can't know whethere we are going to try to connect
  // and the first render is important here
  const [walletConnecting, setWalletConnecting] = useState(true);

  const [getCurrentUser] = useGetCurrentUserLazyQuery();

  const {
    joinedColonies,
    loading: joinedColoniesLoading,
    refetch: refetchJoinedColonies,
  } = useJoinedColonies(wallet?.address);

  const updateUser = useCallback(
    async (address: string | undefined, shouldBackgroundUpdate = false) => {
      if (address) {
        try {
          if (!shouldBackgroundUpdate) {
            setUserLoading(true);
          }

          // Fetch authenticated user's private data using GetCurrentUser query
          const { data } = await getCurrentUser({
            variables: {
              address: utils.getAddress(address),
            },
            fetchPolicy: 'network-only',
          });
          // GetCurrentUser uses UserPrivate fragment which includes sensitive data
          const [authenticatedUser] = data?.getUserByAddress?.items || [];
          if (authenticatedUser) {
            setUser(authenticatedUser);
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
    [getCurrentUser],
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
  const disconnectWallet = useCallback(
    async ({ shouldRemoveWalletContext = true } = {}) => {
      try {
        await userLogout({ shouldRemoveWalletContext });
      } catch (error) {
        console.error('Could not disconnect wallet', error);
        return;
      }
      setWallet(null);
      setUser(null);
    },
    [setWallet, setUser, userLogout],
  );

  /*
   * When the user switches account in Metamask, re-initiate the wallet connect flow
   * so as to update their wallet details in the app's memory.
   */
  const handleAccountChange = useCallback(async () => {
    // @ts-ignore
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    const loggedInAccount = accounts[0];
    await disconnectWallet({ shouldRemoveWalletContext: false });
    if (loggedInAccount) {
      connectWallet();
    }
  }, [connectWallet, disconnectWallet]);

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

  const appContext = useMemo<AppContextValue>(
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
      joinedColonies,
      joinedColoniesLoading,
      refetchJoinedColonies,
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
      joinedColonies,
      joinedColoniesLoading,
      refetchJoinedColonies,
    ],
  );

  return (
    <AppContext.Provider value={appContext}>
      <TokenActivationProvider>{children}</TokenActivationProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
