import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { type User } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface AppContextValues {
  wallet?: ColonyWallet | null;
  walletConnecting: boolean;
  setWalletConnecting: Dispatch<SetStateAction<boolean>>;
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

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('This hook must be used within the "AppContext" provider');
  }

  return appContext;
};
