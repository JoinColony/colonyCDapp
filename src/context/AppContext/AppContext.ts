import { type ColonyNetwork, type Colony } from '@colony/sdk';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { type JoinedColony, type User } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

import type ColonyManager from './ColonyManager.ts';

export interface AppContextValue {
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
  joinedColonies: JoinedColony[];
  joinedColoniesLoading: boolean;
  colonyManager: ColonyManager;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('This hook must be used within the "AppContext" provider');
  }

  return appContext;
};

export const useColonyNetwork = () => {
  const { colonyManager } = useAppContext();
  const [colonyNetwork, setColonyNetwork] = useState<ColonyNetwork | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    colonyManager.getColonyNetwork().then((network) => {
      if (network) {
        setColonyNetwork(network);
      }
      setLoading(false);
    });
  }, [colonyManager]);
  return { colonyNetwork, loading };
};

export const useColonyContract = (colonyAddress: string) => {
  const { colonyManager } = useAppContext();
  const [colonyContract, setColony] = useState<Colony | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    colonyManager.getColony(colonyAddress).then((colony) => {
      if (colony) {
        setColony(colony);
      }
      setLoading(false);
    });
  }, [colonyAddress, colonyManager]);
  return { colonyContract, loading };
};
