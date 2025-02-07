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
import useLocalStorage from 'use-local-storage';

import { deauthenticateWallet } from '~auth/index.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useGetUserByAddressLazyQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useJoinedColonies from '~hooks/useJoinedColonies.ts';
import { ActionTypes } from '~redux/index.ts';
import retryProviderFactory from '~redux/sagas/wallet/RetryProvider.ts';
import debugLogging from '~utils/debug/debugLogging.ts';

import { getContext, ContextModule, setContext } from '../index.ts';
import { TokenActivationProvider } from '../TokenActivationContext/TokenActivationContextProvider.tsx';

import { AppContext, type AppContextValue } from './AppContext.ts';

enum DynamicLocalStorageKeys {
  CONNECTED_WALLETS = 'dynamic_connected_wallets',
  CONNECTED_WALLET_NS = 'dynamic_connected_wallet_ns',
  STORE = 'dynamic_store',
  SOCIAL_STORAGE = 'dynamic_social_storage',
  LAST_USED_WALLET = 'dynamic_last_used_wallet',
  DEVICE_FINGERPRINT = 'dynamic_device_fingerprint',
  CONTEXT_SESSION_SETTINGS = 'dynamic_context_session_settings',
  TURNKEY_LAST_USED_CHAIN_ID = 'turnkey-last-used-chain-id',
}

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<AppContextValue['wallet']>();
  const [user, setUser] = useState<AppContextValue['user']>();
  const [userLoading, setUserLoading] = useState(false);
  // We need to start with true here as we can't know whethere we are going to try to connect
  // and the first render is important here
  const [walletConnecting, setWalletConnecting] = useState(false);
  const { setShowAuthFlow, handleLogOut, primaryWallet } = useDynamicContext();
  const [getUserByAddress] = useGetUserByAddressLazyQuery();
  const [autoConnectedWalletAddress] = useLocalStorage(
    DynamicLocalStorageKeys.CONNECTED_WALLET_NS,
    undefined,
  );
  const [willWalletAutoConnect, setWillWalletAutoConnect] = useState(
    autoConnectedWalletAddress || false,
  );

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

        debugLogging('WALLET SETTING CONTEXT', dynamicWallet);

        setContext(ContextModule.Wallet, dynamicWallet);

        setWallet(dynamicWallet);

        setWillWalletAutoConnect(true);

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
      // Temporary! (Like all other permanant solutions)
      // This will put the app in a loading state preventing the user from interacting
      // with anything until they have authenticated with the auth proxy
      setWalletConnecting(true);
      await setupUserContext(undefined);
      setWalletConnecting(false);
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

  const clearDynamicWalletStorage = useCallback(() => {
    localStorage.removeItem(DynamicLocalStorageKeys.STORE);
    localStorage.removeItem(DynamicLocalStorageKeys.SOCIAL_STORAGE);
    localStorage.removeItem(DynamicLocalStorageKeys.LAST_USED_WALLET);
    localStorage.removeItem(DynamicLocalStorageKeys.DEVICE_FINGERPRINT);
    localStorage.removeItem(DynamicLocalStorageKeys.CONTEXT_SESSION_SETTINGS);
    localStorage.removeItem(DynamicLocalStorageKeys.TURNKEY_LAST_USED_CHAIN_ID);
    debugLogging('WALLET STORAGE CLEARED');
  }, []);

  const clearDynamicWalletAutoLogin = useCallback(() => {
    localStorage.removeItem(DynamicLocalStorageKeys.CONNECTED_WALLETS); // will not exist for embedded wallets
    localStorage.removeItem(DynamicLocalStorageKeys.CONNECTED_WALLET_NS);
    debugLogging('WALLET AUTOLOGIN CLEARED');
  }, []);

  /*
   * Manually Trigger Wallet Connection by pressing the "Connect Wallet" button
   */
  const connectWallet = useCallback(async () => {
    try {
      clearDynamicWalletStorage();
      setShowAuthFlow(true);
    } catch (error) {
      debugLogging('WALLET COULD NOT BE CONNECTED', error);
    }
  }, [clearDynamicWalletStorage, setShowAuthFlow]);

  /*
   * Handle wallet disconnection
   */
  const disconnectWallet = useCallback(
    async ({ shouldRemoveWalletContext = true } = {}) => {
      try {
        setWalletConnecting(true);
        clearDynamicWalletAutoLogin();
        setWillWalletAutoConnect(false);
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
    [clearDynamicWalletAutoLogin, userLogout, handleLogOut],
  );

  // Embedded Wallet Logout
  useDynamicEvents('logout', async (...args) => {
    // Only log out if a wallet is set, and if that wallet is embedded
    if (wallet?.label === 'turnkeyhd') {
      debugLogging('WALLET EMBEDDED LOGOUT', args);
      await disconnectWallet();
    }
  });

  // Handle wallet connected
  useEffect(() => {
    const walletHandler = async () => {
      if (primaryWallet) {
        const primaryWalletAddress = utils.getAddress(primaryWallet.address);
        let contextWallet;

        try {
          contextWallet = getContext(ContextModule.Wallet);
        } catch (error) {
          // no wallet in context
        }

        if (!contextWallet) {
          if (primaryWallet?.connector.supportsNetworkSwitching()) {
            try {
              const currentPrimaryWalletChainId =
                await primaryWallet.getNetwork();
              const requiredChainId = parseInt(
                DEFAULT_NETWORK_INFO.chainId,
                10,
              );
              // Only swith the chain if not already on it
              if (currentPrimaryWalletChainId !== requiredChainId) {
                await primaryWallet.switchNetwork(
                  parseInt(DEFAULT_NETWORK_INFO.chainId, 10),
                );
                debugLogging(
                  'WALLET AUTOMATICALLY SWITCHED NETWORK',
                  currentPrimaryWalletChainId,
                  parseInt(DEFAULT_NETWORK_INFO.chainId, 10),
                );
              }
            } catch (error) {
              debugLogging('WALLET AUTOMATIC NETWORK SWITCH FAILED', error);
            }
          }

          await updateWallet();

          await updateUser(primaryWalletAddress);

          await setUserContextWithErrorFallback();

          return;
        }

        // App crashed an have to recover
        if (contextWallet?.address === primaryWalletAddress && !wallet) {
          await updateWallet();

          await updateUser(primaryWalletAddress);

          await setUserContextWithErrorFallback();

          debugLogging('WALLET RECOVER AFTER CRASH', {
            primaryWallet,
            contextWallet,
            wallet,
          });
        }
      }
    };
    walletHandler();
  }, [
    primaryWallet,
    setUserContextWithErrorFallback,
    updateUser,
    updateWallet,
    wallet,
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

          setWalletConnecting(true);

          await deauthenticateWallet();

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
      willWalletAutoConnect,
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
      willWalletAutoConnect,
    ],
  );

  return (
    <AppContext.Provider value={appContext}>
      <TokenActivationProvider>{children}</TokenActivationProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
