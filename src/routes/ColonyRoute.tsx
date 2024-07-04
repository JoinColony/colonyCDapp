import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import ActionSidebarContextProvider from '~context/ActionSidebarContext/ActionSidebarContextProvider.tsx';
import {
  useAppContext,
  useColonyContract,
} from '~context/AppContext/AppContext.ts';
import { type RefetchColonyFn } from '~context/ColonyContext/ColonyContext.ts';
import ColonyContextProvider from '~context/ColonyContext/ColonyContextProvider.tsx';
import ColonyCreateModalProvider from '~context/ColonyCreateModalContext/ColonyCreateModalContextProvider.tsx';
import ColonyDecisionProvider from '~context/ColonyDecisionContext/ColonyDecisionContextProvider.tsx';
import MemberContextProvider from '~context/MemberContext/MemberContextProviderWithSearchAndFilter.tsx';
import MemberModalProvider from '~context/MemberModalContext/MemberModalContextProvider.tsx';
import TokensModalContextProvider from '~context/TokensModalContext/TokensModalContextProvider.tsx';
import UserTokenBalanceProvider from '~context/UserTokenBalanceContext/UserTokenBalanceContextProvider.tsx';
import { ColonyLayout } from '~frame/Extensions/layouts/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { useGetFullColonyByNameQuery } from '~gql';
import useIsContributor from '~hooks/useIsContributor.ts';
import { type Colony } from '~types/graphql.ts';

import NotFoundRoute from './NotFoundRoute.tsx';

const displayName = 'routes.ColonyRoute';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

interface ColonyRouteInnerProps {
  colony: Colony;
  refetchColony: RefetchColonyFn;
  startPollingColonyData: (pollInterval: number) => void;
  stopPollingColonyData: () => void;
}

const ColonyRouteInner = ({
  colony,
  refetchColony,
  startPollingColonyData,
  stopPollingColonyData,
}: ColonyRouteInnerProps) => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { colonyAddress } = colony;
  const { colonyContract, loading: contractLoading } =
    useColonyContract(colonyAddress);

  const { isContributor, loading: isContributorLoading } = useIsContributor({
    colonyAddress,
    walletAddress: user?.walletAddress,
  });

  if (
    contractLoading ||
    walletConnecting ||
    userLoading ||
    isContributorLoading
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user || !isContributor) {
    return <Navigate to={`/go/${colony.name}`} />;
  }

  if (!colonyContract) {
    return <NotFoundRoute />;
  }

  return (
    <ColonyContextProvider
      colony={colony}
      colonyContract={colonyContract}
      refetchColony={refetchColony}
      startPollingColonyData={startPollingColonyData}
      stopPollingColonyData={stopPollingColonyData}
    >
      <MemberContextProvider>
        <ActionSidebarContextProvider>
          <ColonyDecisionProvider>
            <UserTokenBalanceProvider>
              <MemberModalProvider>
                <ColonyCreateModalProvider>
                  <TokensModalContextProvider>
                    <ColonyLayout>
                      <Outlet />
                    </ColonyLayout>
                  </TokensModalContextProvider>
                </ColonyCreateModalProvider>
              </MemberModalProvider>
            </UserTokenBalanceProvider>
          </ColonyDecisionProvider>
        </ActionSidebarContextProvider>
      </MemberContextProvider>
    </ColonyContextProvider>
  );
};

const ColonyRoute = () => {
  const { colonyName = '' } = useParams();
  const {
    data,
    loading,
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

  if (loading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  if (!colony || error) {
    if (error) {
      console.error(error);
    }
    return <NotFoundRoute />;
  }

  return (
    <ColonyRouteInner
      colony={colony}
      refetchColony={refetchColony}
      startPollingColonyData={startPolling}
      stopPollingColonyData={stopPolling}
    />
  );
};

export default ColonyRoute;
