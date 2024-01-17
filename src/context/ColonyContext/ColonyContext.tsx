import { ApolloQueryResult } from '@apollo/client';
import React, { createContext, useMemo, ReactNode } from 'react';

import { Exact, GetFullColonyByNameQuery } from '~gql';
import { useCanInteractWithColony, useColonySubscription } from '~hooks';
import { Colony } from '~types';

import { useUpdateColonyReputation } from './useUpdateColonyReputation';

export type RefetchColonyFn = (
  variables?:
    | Partial<
        Exact<{
          name: string;
        }>
      >
    | undefined,
) => Promise<ApolloQueryResult<GetFullColonyByNameQuery>> | null;
interface ColonyContextValue {
  colony: Colony;
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

const ColonyContext = createContext<ColonyContextValue | null>(null);

const displayName = 'ColonyContextProvider';

const MIN_SUPPORTED_COLONY_VERSION = 5;

export const ColonyContextProvider = ({
  children,
  colony,
  refetchColony,
  startPollingColonyData,
  stopPollingColonyData,
}: {
  children: ReactNode;
  colony: Colony;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
}) => {
  useUpdateColonyReputation(colony?.colonyAddress);

  const canInteractWithColony = useCanInteractWithColony(colony);
  const isSupportedColonyVersion =
    (colony?.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonySubscription = useColonySubscription(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      canInteractWithColony,
      refetchColony,
      startPollingColonyData,
      stopPollingColonyData,
      isSupportedColonyVersion,
      colonySubscription,
    }),
    [
      colony,
      canInteractWithColony,
      refetchColony,
      startPollingColonyData,
      stopPollingColonyData,
      isSupportedColonyVersion,
      colonySubscription,
    ],
  );

  return (
    <ColonyContext.Provider value={colonyContext}>
      {children}
    </ColonyContext.Provider>
  );
};

ColonyContext.displayName = displayName;

export { ColonyContext };
