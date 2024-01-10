import { ApolloQueryResult } from '@apollo/client';
import React, { createContext, useMemo, ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';

import LoadingTemplate from '~frame/LoadingTemplate';
import {
  Exact,
  GetFullColonyByNameQuery,
  useGetColonyWhitelistByNameQuery,
} from '~gql';
import {
  useAppContext,
  useCanInteractWithColony,
  useColonySubscription,
} from '~hooks';
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

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const MIN_SUPPORTED_COLONY_VERSION = 5;

export const ColonyContextProvider = ({
  children,
  colony,
  refetchColony,
  startPollingColonyData,
  stopPollingColonyData,
  isColonyLoading,
}: {
  children: ReactNode;
  colony: Colony;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
  isColonyLoading: boolean;
}) => {
  const { colonyName = '' } = useParams();
  const { user, userLoading, walletConnecting } = useAppContext();

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

  // @TODO: This is terrible. Once we have auth, we need a method
  // to check whether the logged in user is a member of the Colony
  const { data: dataWhitelist, loading: whitelistLoading } =
    useGetColonyWhitelistByNameQuery({
      variables: { name: colonyName },
      skip: !colonyName,
    });

  if (walletConnecting || isColonyLoading || userLoading || whitelistLoading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const isMember = !!dataWhitelist?.getColonyByName?.items[0]?.whitelist.some(
    (addr) => addr === user?.walletAddress,
  );

  if (!user || !isMember) {
    return <Navigate to={`/go/${colony.name}`} />;
  }

  return (
    <ColonyContext.Provider value={colonyContext}>
      {children}
    </ColonyContext.Provider>
  );
};

ColonyContext.displayName = displayName;

export { ColonyContext };
