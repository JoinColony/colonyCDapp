import { type ApolloQueryResult } from '@apollo/client';
import { type Colony as ColonyContract } from '@colony/sdk';
import { createContext, useContext } from 'react';

import { type Exact, type GetFullColonyByNameQuery } from '~gql';
import { type Colony } from '~types/graphql.ts';

export type RefetchColonyFn = (
  variables?:
    | Partial<
        Exact<{
          name: string;
        }>
      >
    | undefined,
) => Promise<ApolloQueryResult<GetFullColonyByNameQuery>> | null;

export const ColonyContext = createContext<ColonyContextValue | null>(null);

export interface ColonyContextValue {
  colony: Colony;
  colonyContract: ColonyContract;
  canInteractWithColony: boolean;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
  isSupportedColonyVersion: boolean;
  colonySubscription: {
    canWatch: boolean;
    isWatching: boolean;
    handleWatch: () => void;
    handleUnwatch: () => void;
  };
}

export const useColonyContext = () => {
  const context = useContext(ColonyContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyContext" provider',
    );
  }

  return context;
};
