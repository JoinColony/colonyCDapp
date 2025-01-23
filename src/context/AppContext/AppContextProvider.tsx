import {
  useDynamicContext,
  useDynamicEvents,
} from '@dynamic-labs/sdk-react-core';
import { utils } from 'ethers';
import React, {
  useState,
  useMemo,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';

import { useGetUserByAddressLazyQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useJoinedColonies from '~hooks/useJoinedColonies.ts';
import { ActionTypes } from '~redux/index.ts';
import retryProviderFactory from '~redux/sagas/wallet/RetryProvider.ts';
import debugLogging from '~utils/debug/debugLogging.ts';

import { getContext, ContextModule, setContext } from '../index.ts';
import { TokenActivationProvider } from '../TokenActivationContext/TokenActivationContextProvider.tsx';

import { AppContext, type AppContextValue } from './AppContext.ts';

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<AppContextValue['wallet']>();
  const [user, setUser] = useState<AppContextValue['user']>();
  const [userLoading, setUserLoading] = useState(false);
  // We need to start with true here as we can't know whethere we are going to try to connect
  // and the first render is important here
  const [walletConnecting, setWalletConnecting] = useState(false);
  const { setShowAuthFlow, handleLogOut, primaryWallet } = useDynamicContext();

  const [getUserByAddress] = useGetUserByAddressLazyQuery();

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

          // Only request new user data if the wallet actually changed
          if (user?.walletAddress !== address) {
            const { data } = await getUserByAddress({
              variables: {
                address: utils.getAddress(address),
              },
              fetchPolicy: 'network-only',
            });
            const [currentUser] = data?.getUserByAddress?.items || [];
            if (currentUser) {
              setUser(currentUser);
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setUserLoading(false);
        }
      }
    },
    [getUserByAddress, user],
  );

  const updateWallet = useCallback(async () => {
    try {
      if (primaryWallet) {
        setWalletConnecting(true);

        // Both methods exist as described by the documentation
        // https://docs.dynamic.xyz/wallets/using-wallets/evm/evm-wallets#ethereum-wallet-methods
        // and as supported by the code actually working
        // I suspect their types are the ones not working properly here
        // @ts-ignore
        const publicClient = await primaryWallet.getPublicClient();
        // @ts-ignore
        const walletClient = await primaryWallet.getWalletClient();

        const walletAddress = utils.getAddress(primaryWallet.address);

        const RetryProvider = retryProviderFactory(
          walletClient.transport,
          walletAddress,
        );
        const provider = new RetryProvider();

        const dynamicWallet = {
          ...walletClient,
          publicClient,
          ethersProvider: provider,
          provider,
          primaryWallet,
          address: walletAddress,
          label: primaryWallet.key,
          chains: [publicClient.chain, walletClient.chain],
        };

        debugLogging('SETTING WALLET CONTEXT', dynamicWallet);

        setContext(ContextModule.Wallet, dynamicWallet);

        setWallet(dynamicWallet);

        setWalletConnecting(false);
      }
    } catch (error) {
      // It means that it was not set in context yet
    }
  }, [primaryWallet]);

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

  const setUserContextWithErrorFallback = useCallback(async () => {
    try {
      await setupUserContext(undefined);
    } catch (error) {
      // In case of error clear out the wallet and user (in the local state)
      // All the others are cleared by the `userLogout` saga call which is called
      // automatically if the `setupUserContext` saga fails
      setWalletConnecting(true);
      await handleLogOut();
      setWallet(null);
      setUser(null);
      setWalletConnecting(false);
    }
  }, [setupUserContext, setWallet, setUser, setWalletConnecting, handleLogOut]);

  /*
   * Trigger wallet connection
   */
  const connectWallet = useCallback(async () => {
    try {
      setWalletConnecting(true);
      setShowAuthFlow(true);
    } catch (error) {
      console.error('Could not connect wallet', error);
    } finally {
      setWalletConnecting(false);
    }
  }, [setWalletConnecting, setShowAuthFlow]);

  /*
   * Handle wallet disconnection
   */
  const disconnectWallet = useCallback(
    async ({ shouldRemoveWalletContext = true } = {}) => {
      try {
        setWalletConnecting(true);
        await userLogout({ shouldRemoveWalletContext });
        await handleLogOut();
        setWalletConnecting(false);
      } catch (error) {
        console.error('Could not disconnect wallet', error);
        return;
      }
      setWallet(null);
      setUser(null);
    },
    [setWallet, setUser, userLogout, handleLogOut],
  );

  // Handle wallet connected
  useEffect(() => {
    const walletHandler = async () => {
      if (primaryWallet) {
        let contextWallet;

        try {
          contextWallet = getContext(ContextModule.Wallet);
        } catch (error) {
          // no wallet in context
        }

        if (!contextWallet) {
          const primaryWalletAddress = utils.getAddress(primaryWallet.address);

          await updateWallet();

          await updateUser(primaryWalletAddress);

          await setUserContextWithErrorFallback();
        }
      }
    };
    walletHandler();
  }, [
    primaryWallet,
    setUserContextWithErrorFallback,
    updateUser,
    updateWallet,
  ]);

  // Network changed
  useDynamicEvents('primaryWalletNetworkChanged', async (...args) => {
    debugLogging('WALLET NETWORK CHANGED', args);
    await updateWallet();
  });

  // Wallet address changed
  useEffect(() => {
    const watchForWalletChange = async () => {
      if (primaryWallet && wallet) {
        const primaryWalletAddress = utils.getAddress(primaryWallet.address);
        if (primaryWalletAddress !== wallet.address) {
          debugLogging('WALLET ADDRESS CHANGED', primaryWallet);

          await updateWallet();

          await updateUser(primaryWalletAddress);

          await setUserContextWithErrorFallback();
        }
      }
    };
    watchForWalletChange();
  }, [
    primaryWallet,
    setUserContextWithErrorFallback,
    updateUser,
    updateWallet,
    wallet,
  ]);

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
