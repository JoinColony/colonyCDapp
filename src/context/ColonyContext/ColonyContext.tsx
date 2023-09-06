import React, { createContext, useMemo, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ApolloQueryResult } from '@apollo/client';

import {
  Exact,
  GetFullColonyByNameQuery,
  useGetFullColonyByNameQuery,
} from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useCanInteractWithColony } from '~hooks';
import { PageThemeContextProvider } from '../PageThemeContext';
import { UserTokenBalanceProvider } from '../UserTokenBalanceContext';

import { ColonyDecisionProvider } from '../ColonyDecisionContext';
import { NOT_FOUND_ROUTE } from '~routes';
import { useUpdateColonyReputation } from './useUpdateColonyReputation';
import { usePreviousColonyName } from './usePreviousColonyName';
import { usePreviousColony } from './usePreviousColony';

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
export const PREV_COLONY_LOCAL_STORAGE_KEY = 'prevColonyName';

const getColonyNameFromPath = (path: string) => {
  const pathFragments = path.split('/');
  const idx = pathFragments.indexOf('colony') + 1;
  return pathFragments[idx];
};

export const ColonyContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { pathname } = useLocation();
  const colonyName = getColonyNameFromPath(pathname);
  const navigate = useNavigate();

  const { hideLoader, prevColonyName } = usePreviousColonyName({
    colonyName,
  });

  const {
    data,
    loading: loadingColony,
    error,
    refetch: refetchColony,
    startPolling,
    stopPolling,
  } = useGetFullColonyByNameQuery({
    variables: {
      name: colonyName || prevColonyName,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;
  const { prevColony } = usePreviousColony({ colony });
  useUpdateColonyReputation(colony?.colonyAddress);

  const canInteractWithColony = useCanInteractWithColony(colony);
  const isSupportedColonyVersion =
    (colony?.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony: colony ?? prevColony,
      loading: loadingColony,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
    }),
    [
      colony,
      prevColony,
      loadingColony,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
    ],
  );

  const colonyNotFound = !colony || error;

  useEffect(() => {
    if (!loadingColony && colonyNotFound) {
      navigate(NOT_FOUND_ROUTE, { replace: true });
    }
  }, [loadingColony, colonyNotFound, navigate]);

  if (loadingColony && !hideLoader) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  return (
    <ColonyContext.Provider value={colonyContext}>
      <ColonyDecisionProvider colony={colony}>
        <UserTokenBalanceProvider>
          <PageThemeContextProvider>{children}</PageThemeContextProvider>
        </UserTokenBalanceProvider>
      </ColonyDecisionProvider>
    </ColonyContext.Provider>
  );
};

ColonyContext.displayName = displayName;

export { ColonyContext };
