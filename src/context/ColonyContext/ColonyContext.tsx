import React, { createContext, useMemo, ReactNode } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ApolloQueryResult } from '@apollo/client';

import {
  Exact,
  GetFullColonyByNameQuery,
  useGetColonyWhitelistByNameQuery,
  useGetFullColonyByNameQuery,
} from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import {
  useAppContext,
  useCanInteractWithColony,
  useColonySubscription,
} from '~hooks';
import { NotFoundRoute } from '~routes';

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
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
  refetchColony: RefetchColonyFn;
  startPolling: (pollInterval: number) => void;
  stopPolling: () => void;
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
}: {
  children: ReactNode;
}) => {
  const { colonyName = '' } = useParams();
  const { user, userLoading, walletConnecting } = useAppContext();

  const {
    data,
    loading: colonyLoading,
    error,
    refetch: refetchColony,
    startPolling,
    stopPolling,
  } = useGetFullColonyByNameQuery({
    variables: {
      name: colonyName,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;
  useUpdateColonyReputation(colony?.colonyAddress);

  const canInteractWithColony = useCanInteractWithColony(colony);
  const isSupportedColonyVersion =
    (colony?.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonySubscription = useColonySubscription(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      loading: colonyLoading,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
      colonySubscription,
    }),
    [
      colony,
      colonyLoading,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
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

  if (walletConnecting || colonyLoading || userLoading || whitelistLoading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!colony || error) {
    if (error) {
      console.error(error);
    }
    return <NotFoundRoute />;
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
