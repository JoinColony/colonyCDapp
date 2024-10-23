import React, { useEffect, useMemo, type ReactNode, useState } from 'react';

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

const useUpdateColonyReputation = ({
  colonyAddress,
  refetchColony,
}: {
  colonyAddress?: string;
  refetchColony: RefetchColonyFn;
}) => {
  const [isReputationUpdating, setIsReputationUpdating] = useState(false);
  useState(false);
  const [updateContributorsWithReputation] =
    useUpdateContributorsWithReputationMutation();

  /*
   * Update colony-wide reputation whenever a user accesses a colony.
   * Note that this (potentially expensive) calculation will only run if there's new reputation data available,
   * so as to conserve resources. Since it runs inside a lambda, it is not a blocking operation.
   */
  useEffect(() => {
    const updateReputation = async () => {
      if (colonyAddress) {
        setIsReputationUpdating(true);
        try {
          await updateContributorsWithReputation({
            variables: { colonyAddress },
          });

          await refetchColony();
        } catch (error) {
          console.error('Error updating contributors with reputation:', error);
        } finally {
          setIsReputationUpdating(false);
        }
      }
    };
    updateReputation();
  }, [
    colonyAddress,
    refetchColony,
    updateContributorsWithReputation,
    setIsReputationUpdating,
  ]);

  return {
    isReputationUpdating,
  };
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
  const { isReputationUpdating } = useUpdateColonyReputation({
    colonyAddress: colony?.colonyAddress,
    refetchColony,
  });

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
      isReputationUpdating,
      isSupportedColonyVersion,
      colonySubscription,
    }),
    [
      colony,
      canInteractWithColony,
      refetchColony,
      startPollingColonyData,
      stopPollingColonyData,
      isReputationUpdating,
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
