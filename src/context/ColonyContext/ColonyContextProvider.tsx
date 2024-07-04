import { type Colony as ColonyContract } from '@colony/sdk';
import React, { useEffect, useMemo, type ReactNode } from 'react';

import { ContextModule, setContext } from '~context';
import { useAppContext } from '~context/AppContext/AppContext.ts';
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
  colonyContract,
  refetchColony,
  startPollingColonyData,
  stopPollingColonyData,
}: {
  children: ReactNode;
  colony: Colony;
  colonyContract: ColonyContract;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
}) => {
  // FIXME: refactor so that wallet is always available in the AppContext. Use loading bar if appropriate
  const {} = useAppContext();

  useUpdateColonyReputation(colony?.colonyAddress);

  // FIXME: use app context to get wallet and initialize colony network, then initialize colony contract and store it in this context
  // Maybe there can be a loading state so that we know that the current colonyContract is always initialized
  const canInteractWithColony = useCanInteractWithColony(colony);

  // @TODO: (sagas) use the min supported version from colony sdk
  const isSupportedColonyVersion =
    (colony.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonySubscription = useColonySubscription(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      colonyContract,
      canInteractWithColony,
      refetchColony,
      startPollingColonyData,
      stopPollingColonyData,
      isSupportedColonyVersion,
      colonySubscription,
    }),
    [
      colony,
      colonyContract,
      canInteractWithColony,
      refetchColony,
      startPollingColonyData,
      stopPollingColonyData,
      isSupportedColonyVersion,
      colonySubscription,
    ],
  );

  useEffect(() => {
    // @TODO: (sagas) Remove eventually (when getting rid of sagas)
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
