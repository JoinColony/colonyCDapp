import { type ApolloQueryResult } from '@apollo/client';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import {
  type Exact,
  type GetFullColonyByNameQuery,
  useUpdateContributorsWithReputationMutation,
} from '~gql';
import { useCanInteractWithColony } from '~hooks/useCanInteractWithColony.ts';
import useColonySubscription from '~hooks/useColonySubscription.ts';
import { type Colony } from '~types/graphql.ts';

import { uiEvents } from '../uiEvents/index.ts';

const useUpdateColonyReputation = (colonyAddress?: string) => {
  const [updateContributorsWithReputation] =
    useUpdateContributorsWithReputationMutation();

  /*
   * Update colony-wide reputation whenever a user accesses a colony.
   * Note that this (potentially expensive) calculation will only run if there's new reputation data available,
   * so as to conserve resources. Since it runs inside a lambda, it is not a blocking operation.
   */
  useEffect(() => {
    if (colonyAddress) {
      updateContributorsWithReputation({
        variables: { colonyAddress },
      });
    }
  }, [colonyAddress, updateContributorsWithReputation]);
};

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

export const ColonyContext = createContext<ColonyContextValue | null>(null);

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

  if (canInteractWithColony) {
    uiEvents.group(colony.colonyAddress, {
      name: colony.name,
      displayName: colony.metadata?.displayName,
      description: colony.metadata?.description,
      token: {
        address: colony.nativeToken?.tokenAddress,
        symbol: colony.nativeToken?.symbol,
        name: colony.nativeToken?.name,
      },
      version: colony.version,
      teamsCount: colony.domains?.items?.length,
    });
  }

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

export const useColonyContext = () => {
  const context = useContext(ColonyContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyContext" provider',
    );
  }

  return context;
};
