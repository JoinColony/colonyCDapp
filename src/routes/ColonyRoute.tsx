import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import ActionSidebarContextProvider from '~context/ActionSidebarContext/ActionSidebarContextProvider.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useBreadcrumbsContext } from '~context/BreadcrumbsContext/BreadcrumbsContext.ts';
import ColonyContextProvider from '~context/ColonyContext/ColonyContextProvider.tsx';
import ColonyCreateModalProvider from '~context/ColonyCreateModalContext/ColonyCreateModalContextProvider.tsx';
import ColonyDecisionProvider from '~context/ColonyDecisionContext/ColonyDecisionContextProvider.tsx';
import MemberContextProvider from '~context/MemberContext/MemberContextProviderWithSearchAndFilter.tsx';
import MemberModalProvider from '~context/MemberModalContext/MemberModalContextProvider.tsx';
import PaymentBuilderContextProvider from '~context/PaymentBuilderContext/PaymentBuilderContextProvider.tsx';
import TokensModalContextProvider from '~context/TokensModalContext/TokensModalContextProvider.tsx';
import UserTokenBalanceProvider from '~context/UserTokenBalanceContext/UserTokenBalanceContextProvider.tsx';
import { ColonyLayout } from '~frame/Extensions/layouts/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { useGetFullColonyByNameQuery } from '~gql';
import useIsContributor from '~hooks/useIsContributor.ts';
import { formatText } from '~utils/intl.ts';

import NotFoundRoute from './NotFoundRoute.tsx';

const displayName = 'routes.ColonyRoute';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
  dashboardBreadcrumbLabel: {
    id: `${displayName}.dashboardBreadcrumbLabel`,
    defaultMessage: 'Dashboard',
  },
});

const ColonyRoute = () => {
  const { colonyName = '' } = useParams();
  const { setRootBreadcrumbItem, setShouldShowBreadcrumbs, resetBreadcrumbs } =
    useBreadcrumbsContext();
  const {
    data,
    loading: isColonyLoading,
    error,
    refetch: refetchColony,
    startPolling,
    stopPolling,
  } = useGetFullColonyByNameQuery({
    variables: {
      name: colonyName,
    },
    fetchPolicy: 'network-only',
  });

  const { user, userLoading, walletConnecting } = useAppContext();

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  const { isContributor, loading: isContributorLoading } = useIsContributor({
    colonyAddress: colony?.colonyAddress,
    walletAddress: user?.walletAddress,
  });

  useEffect(() => {
    setRootBreadcrumbItem({
      link: `/${colonyName}`,
      label: formatText(MSG.dashboardBreadcrumbLabel),
    });
    setShouldShowBreadcrumbs(true);
    return () => {
      resetBreadcrumbs();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colonyName]);

  if (
    walletConnecting ||
    isColonyLoading ||
    userLoading ||
    isContributorLoading
  ) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!colony || error) {
    if (error) {
      console.error(error);
    }
    return <NotFoundRoute />;
  }

  if (!user || !isContributor) {
    return <Navigate to={`/go/${colony.name}`} />;
  }

  return (
    <ColonyContextProvider
      colony={colony}
      refetchColony={refetchColony}
      startPollingColonyData={startPolling}
      stopPollingColonyData={stopPolling}
    >
      <MemberContextProvider>
        <ActionSidebarContextProvider>
          <ColonyDecisionProvider>
            <UserTokenBalanceProvider>
              <MemberModalProvider>
                <ColonyCreateModalProvider>
                  <TokensModalContextProvider>
                    <PaymentBuilderContextProvider>
                      <ColonyLayout>
                        <Outlet />
                      </ColonyLayout>
                    </PaymentBuilderContextProvider>
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

export default ColonyRoute;
