import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import {
  ColonyCreatedModalProvider,
  ActionSidebarContextProvider,
  ColonyContextProvider,
  ColonyDecisionProvider,
  MemberModalProvider,
  UserTokenBalanceProvider,
  UserTransactionContextProvider,
  TokensModalContextProvider,
} from '~context';
import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import { ColonyLayout } from '~frame/Extensions/layouts';
import { useGetFullColonyByNameQuery } from '~gql';

import NotFoundRoute from './NotFoundRoute';

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

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  if (!colony || error) {
    if (error) {
      console.error(error);
    }
    return <NotFoundRoute />;
  }

  return (
    <ColonyContextProvider
      colony={colony}
      isColonyLoading={loading}
      refetchColony={refetchColony}
      startPollingColonyData={startPolling}
      stopPollingColonyData={stopPolling}
    >
      <MemberContextProvider>
        <ActionSidebarContextProvider>
          <ColonyDecisionProvider>
            <UserTokenBalanceProvider>
              <MemberModalProvider>
                <ColonyCreatedModalProvider>
                  <UserTransactionContextProvider>
                    <TokensModalContextProvider>
                      <ColonyLayout>
                        <Outlet />
                      </ColonyLayout>
                    </TokensModalContextProvider>
                  </UserTransactionContextProvider>
                </ColonyCreatedModalProvider>
              </MemberModalProvider>
            </UserTokenBalanceProvider>
          </ColonyDecisionProvider>
        </ActionSidebarContextProvider>
      </MemberContextProvider>
    </ColonyContextProvider>
  );
};

export default ColonyRoute;
