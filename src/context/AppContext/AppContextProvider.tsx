import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
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
        } catch (error) {
          console.error(error);
        } finally {
          setUserLoading(false);
        }
      }
    },
    [getUserByAddress],
  );

  const updateWallet = useCallback(() => {
    try {
      const updatedWallet = getContext(ContextModule.Wallet);
      // updatedWallet.address = utils.getAddress(
      //   updatedWallet.address,
      // ) as `0x${string}`;
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
      // await setupUserContext(undefined);
      setWalletConnecting(true);
      // updateWallet();
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
        await handleLogOut();
        await userLogout({ shouldRemoveWalletContext });
      } catch (error) {
        console.error('Could not disconnect wallet', error);
        return;
      }
      setWallet(null);
      setUser(null);
    },
    [setWallet, setUser, userLogout, handleLogOut],
  );

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
          // no wallet exists, set it
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

          await setupUserContext(undefined);

          updateWallet();

          setWalletConnecting(false);
        }

        // setWallet(primaryWallet);
      }
    };
    walletHandler();
  }, [primaryWallet, setupUserContext, updateWallet]);

  /*
   * When the user switches account in Metamask, re-initiate the wallet connect flow
   * so as to update their wallet details in the app's memory.
   */
  // const handleAccountChange = useCallback(async () => {
  //   // @ts-ignore
  //   const accounts = await window.ethereum.request({
  //     method: 'eth_accounts',
  //   });
  //   const loggedInAccount = accounts[0];
  //   await disconnectWallet({ shouldRemoveWalletContext: false });
  //   if (loggedInAccount) {
  //     connectWallet();
  //   }
  // }, [connectWallet, disconnectWallet]);

  // const previousAccountChange = usePrevious(handleAccountChange);

  // useEffect(() => {
  //   if (window.ethereum) {
  //     if (previousAccountChange) {
  //       // @ts-ignore
  //       window.ethereum.removeListener(
  //         'accountsChanged',
  //         previousAccountChange,
  //       );
  //     }
  //     // @ts-ignore
  //     window.ethereum.on('accountsChanged', handleAccountChange);
  //   }

  //   return () => {
  //     if (window.ethereum) {
  //       // @ts-ignore
  //       window.ethereum.removeListener('accountsChanged', handleAccountChange);
  //     }
  //   };
  // }, [handleAccountChange, previousAccountChange]);

  // useEffect(() => {
  //   if (getLastWallet()) {
  //     connectWallet();
  //   } else {
  //     setWalletConnecting(false);
  //   }

  //   // NOTE: We really want this to run exactly once (when the app starts)
  //   // connectWallet is dependent on the wallet itself, so this is to avoid an infinite loop
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
