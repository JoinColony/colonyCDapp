import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { type JoinedColony, type UserPrivate } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface AppContextValue {
  wallet?: ColonyWallet | null;
  walletConnecting: boolean;
  setWalletConnecting: Dispatch<SetStateAction<boolean>>;
  user?: UserPrivate | null;
  userLoading: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  updateUser: (
    address: string | undefined,
    shouldBackgroundUpdate?: boolean,
  ) => Promise<void>;
  canInteract: boolean;
  joinedColonies: JoinedColony[];
  joinedColoniesLoading: boolean;
  refetchJoinedColonies: () => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('This hook must be used within the "AppContext" provider');
  }

  return appContext;
};
