import React from 'react';
import { defineMessages } from 'react-intl';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import ActionSidebarContextProvider from '~context/ActionSidebarContext/ActionSidebarContextProvider.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import ColonyContextProvider from '~context/ColonyContext/ColonyContextProvider.tsx';
import ColonyCreateModalProvider from '~context/ColonyCreateModalContext/ColonyCreateModalContextProvider.tsx';
import ColonyDecisionProvider from '~context/ColonyDecisionContext/ColonyDecisionContextProvider.tsx';
import MemberContextProvider from '~context/MemberContext/MemberContextProviderWithSearchAndFilter.tsx';
import MemberModalProvider from '~context/MemberModalContext/MemberModalContextProvider.tsx';
import TokensModalContextProvider from '~context/TokensModalContext/TokensModalContextProvider.tsx';
import UserTokenBalanceProvider from '~context/UserTokenBalanceContext/UserTokenBalanceContextProvider.tsx';
import UserTransactionContextProvider from '~context/UserTransactionContext/UserTransactionContextProvider.tsx';
import { ColonyLayout } from '~frame/Extensions/layouts/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import {
  useGetColonyWhitelistByNameQuery,
  useGetFullColonyByNameQuery,
} from '~gql';

import NotFoundRoute from './NotFoundRoute.tsx';

const displayName = 'routes.ColonyRoute';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const ColonyRoute = () => {
  const { colonyName = '' } = useParams();
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
    nextFetchPolicy: 'cache-first',
  });
  const { user, userLoading, walletConnecting } = useAppContext();

  // @TODO: This is terrible. Once we have auth, we need a method
  // to check whether the logged in user is a member of the Colony
  const { data: dataWhitelist, loading: whitelistLoading } =
    useGetColonyWhitelistByNameQuery({
      variables: { name: colonyName },
      skip: !colonyName,
    });

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  if (walletConnecting || isColonyLoading || userLoading || whitelistLoading) {
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
                  <UserTransactionContextProvider>
                    <TokensModalContextProvider>
                      <ColonyLayout>
                        <Outlet />
                      </ColonyLayout>
                    </TokensModalContextProvider>
                  </UserTransactionContextProvider>
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
