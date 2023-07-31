import React, {
  createContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ObservableQuery } from '@apollo/client';

import { useGetFullColonyByNameQuery } from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useCanInteractWithColony } from '~hooks';
import { UserTokenBalanceProvider } from './UserTokenBalanceContext';

interface ColonyContextValue {
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
  refetchColony: (() => null) | ObservableQuery['refetch'];
  startPolling: (pollInterval: number) => void;
  stopPolling: () => void;
  isSupportedColonyVersion: boolean;
}

const ColonyContext = createContext<ColonyContextValue>({
  loading: false,
  canInteractWithColony: false,
  refetchColony: () => null,
  startPolling: () => undefined,
  stopPolling: () => undefined,
  isSupportedColonyVersion: false,
});

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
  const { colonyName } = useParams<{ colonyName: string }>();
  const [prevColonyName, setPrevColonyName] = useState<string>();

  const { state: locationState } = useLocation();
  const [isPolling, setIsPolling] = useState(!!colonyName);

  /* Update polling state when routing between colonies */
  useEffect(() => {
    if (colonyName && colonyName !== prevColonyName) {
      setPrevColonyName(colonyName);
      setIsPolling(true);
    }
  }, [colonyName, prevColonyName]);

  const {
    data,
    loading,
    error,
    refetch: refetchColony,
    startPolling,
    stopPolling,
  } = useGetFullColonyByNameQuery({
    skip: !colonyName,
    variables: {
      name: colonyName ?? '',
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000,
  });

  const isRedirect = locationState?.isRedirect;
  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  /* Stop polling if we weren't redirected from the ColonyCreation wizard or when the query returns the colony */
  if (isPolling && (!isRedirect || colony)) {
    stopPolling();
    setIsPolling(false);
  }

  const canInteractWithColony = useCanInteractWithColony(colony);
  const isSupportedColonyVersion =
    (colony?.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      loading,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
    }),
    [
      colony,
      loading,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
    ],
  );

  if (!colonyName) {
    return null;
  }

  if (loading || isPolling) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!colony || error) {
    return <NotFoundRoute />;
  }

  return (
    <ColonyContext.Provider value={colonyContext}>
      <UserTokenBalanceProvider>{children}</UserTokenBalanceProvider>
    </ColonyContext.Provider>
  );
};

ColonyContext.displayName = displayName;

export { ColonyContext };
