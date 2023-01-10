import { utils } from 'ethers';
import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';

import { ActionTypes } from '~redux';
import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';
import { ColonyWallet, User } from '~types';
import { useAsyncFunction } from '~hooks';

import { getContext, ContextModule } from './index';

export interface AppContextValues {
  wallet?: ColonyWallet | null;
  walletConnecting?: boolean;
  setWalletConnecting?: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User | null;
  userLoading?: boolean;
  connectWallet?: () => void;
  updateWallet?: () => void;
  updateUser?: (
    address?: string,
    shouldBackgroundUpdate?: boolean,
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextValues>({});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  let initialWallet: ColonyWallet | undefined;

  /*
   * Wallet
   */
  try {
    initialWallet = getContext(ContextModule.Wallet);
  } catch (error) {
    // silent
    // It means that it was not set in context yet
  }

  const [wallet, setWallet] =
    useState<AppContextValues['wallet']>(initialWallet);
  const [user, setUser] = useState<User | null | undefined>();
  const [userLoading, setUserLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);

  const updateUser = useCallback(
    async (address?: string, shouldBackgroundUpdate = false) => {
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

  const updateWallet = useCallback((): void => {
    try {
      const updatedWallet = getContext(ContextModule.Wallet);
      updatedWallet.address = utils.getAddress(updatedWallet.address);
      setWallet(updatedWallet);
      // Update the user as soon as the wallet address changes
      if (updatedWallet.address !== wallet?.address) {
        updateUser(updatedWallet.address);
      }
    } catch (error) {
      if (wallet) {
        // It means that the user logged out
        setWallet(null);
        setUser(null);
      }
      // It means that it was not set in context yet
    }
  }, [updateUser, wallet]);

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.WALLET_OPEN,
    error: ActionTypes.WALLET_OPEN_ERROR,
    success: ActionTypes.WALLET_OPEN_SUCCESS,
  });

  /*
   * Handle wallet connection
   */
  const connectWallet = useCallback(async () => {
    setWalletConnecting?.(true);
    let walletConnectSuccess = false;
    try {
      await asyncFunction(undefined);
      walletConnectSuccess = true;
    } catch (error) {
      console.error('Could not connect wallet', error);
    }
    if (updateWallet && walletConnectSuccess) {
      updateWallet();
    }
    setWalletConnecting?.(false);
  }, [asyncFunction, updateWallet, setWalletConnecting]);

  // console.log(wallet);

  const appContext = useMemo<AppContextValues>(
    () => ({
      wallet,
      walletConnecting,
      setWalletConnecting,
      user,
      userLoading,
      connectWallet,
      updateWallet,
      updateUser,
    }),
    [
      wallet,
      walletConnecting,
      setWalletConnecting,
      user,
      userLoading,
      connectWallet,
      updateWallet,
      updateUser,
    ],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
