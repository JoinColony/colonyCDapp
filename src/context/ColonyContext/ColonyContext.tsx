import React, {
  createContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ApolloQueryResult } from '@apollo/client';

import {
  Exact,
  GetFullColonyByNameQuery,
  useGetFullColonyByNameQuery,
  useUpdateContributorsWithReputationMutation,
} from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import { useAppContext, useCanInteractWithColony } from '~hooks';
import { PageThemeContextProvider } from '../PageThemeContext';
import { UserTokenBalanceProvider } from '../UserTokenBalanceContext';

import { ColonyDecisionProvider } from '../ColonyDecisionContext';
import { ContextModule, setContext } from '~context';
import { NOT_FOUND_ROUTE } from '~routes';
import { usePreviousColonyName } from './usePreviousName';

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
const METACOLONY_COLONY_NAME = 'meta';
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
  const { user } = useAppContext();
  const { pathname } = useLocation();
  const colonyName = getColonyNameFromPath(pathname);
  const [prevColonyName, setPrevColonyName] = useState<string>(
    METACOLONY_COLONY_NAME,
  );
  const navigate = useNavigate();
  /* Update polling state when routing between colonies */
  useEffect(() => {
    if (colonyName && colonyName !== prevColonyName) {
      setPrevColonyName(colonyName);

      // persist
      if (user?.walletAddress) {
        localStorage.setItem(
          `${PREV_COLONY_LOCAL_STORAGE_KEY}:${user.walletAddress}`,
          colonyName,
        );
      }
    }
  }, [colonyName, prevColonyName, user?.walletAddress]);

  const { hideLoader } = usePreviousColonyName({
    colonyName,
    setPrevColonyName,
    walletAddress: user?.walletAddress,
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

  // This is useful when adding transactions to the db from the client
  if (colony) {
    setContext(ContextModule.CurrentColonyAddress, colony?.colonyAddress);
  }

  const [updateContributorsWithReputation] =
    useUpdateContributorsWithReputationMutation();

  /*
   * Update colony-wide reputation whenever a user accesses a colony.
   * Note that this (potentially expensive) calculation will only run if there's new reputation data available,
   * so as to conserve resources. Since it runs inside a lambda, it is not a blocking operation.
   */
  useEffect(() => {
    if (colony?.colonyAddress) {
      updateContributorsWithReputation({
        variables: { colonyAddress: colony.colonyAddress },
      });
    }
  }, [colony?.colonyAddress, updateContributorsWithReputation]);

  const canInteractWithColony = useCanInteractWithColony(colony);
  const isSupportedColonyVersion =
    (colony?.version ?? 0) >= MIN_SUPPORTED_COLONY_VERSION;

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      loading: loadingColony,
      canInteractWithColony,
      refetchColony,
      startPolling,
      stopPolling,
      isSupportedColonyVersion,
    }),
    [
      colony,
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
