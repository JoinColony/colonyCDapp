import { type ApolloQueryResult } from '@apollo/client';
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
  canInteractWithColony: boolean;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
  isReputationUpdating: boolean;
  isSupportedColonyVersion: boolean;
  colonySubscription: {
    canWatch: boolean;
    isWatching: boolean;
    handleWatch: () => void;
    handleUnwatch: () => void;
  };
}

type UseColonyContextReturnType<T extends boolean | undefined> = T extends true
  ? ColonyContextValue | null
  : ColonyContextValue;

export const useColonyContext = <T extends boolean | undefined = false>(args?: {
  nullableContext: T;
}): UseColonyContextReturnType<T> => {
  const context = useContext(ColonyContext);

  if (!context && !args?.nullableContext) {
    throw new Error(
      'This hook must be used within the "ColonyContext" provider',
    );
  }

  return context as UseColonyContextReturnType<T>;
};
