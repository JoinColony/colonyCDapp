import React, { useEffect, useMemo, type ReactNode } from 'react';

import { ContextModule, setContext } from '~context';
import { useUpdateContributorsWithReputationMutation } from '~gql';
import { useCanInteractWithColony } from '~hooks/useCanInteractWithColony.ts';
import useColonySubscription from '~hooks/useColonySubscription.ts';
import { type Colony } from '~types/graphql.ts';

import {
  ColonyContext,
  type RefetchColonyFn,
  type ColonyContextValue,
} from './ColonyContext.ts';

const MIN_SUPPORTED_COLONY_VERSION = 5;

const displayName = 'ColonyContextProvider';

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

const ColonyContextProvider = ({
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

  useEffect(() => {
    setContext(ContextModule.CurrentColonyAddress, colony.colonyAddress);
  }, [colony.colonyAddress]);

  return (
    <ColonyContext.Provider value={colonyContext}>
      {children}
    </ColonyContext.Provider>
  );
};

ColonyContextProvider.displayName = displayName;

export default ColonyContextProvider;
