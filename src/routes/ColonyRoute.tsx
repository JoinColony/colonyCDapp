import React from 'react';
import { Outlet } from 'react-router-dom';

import { ActionSidebarContextProvider } from '~context/ActionSidebarContext';
import { ColonyContextProvider } from '~context/ColonyContext';
import { ColonyDecisionProvider } from '~context/ColonyDecisionContext';
import { MemberModalProvider } from '~context/MemberModalContext';
import PageHeadingContextProvider from '~context/PageHeadingContext';
import { UserTokenBalanceProvider } from '~context/UserTokenBalanceContext';
import { UserTransactionContextProvider } from '~context/UserTransactionContext';
import { ColonyLayout } from '~frame/Extensions/layouts';

const ColonyRoute = () => (
  <ColonyContextProvider>
    <ActionSidebarContextProvider>
      <ColonyDecisionProvider>
        <UserTokenBalanceProvider>
          <MemberModalProvider>
            <UserTransactionContextProvider>
              <PageHeadingContextProvider>
                <ColonyLayout>
                  <Outlet />
                </ColonyLayout>
              </PageHeadingContextProvider>
            </UserTransactionContextProvider>
          </MemberModalProvider>
        </UserTokenBalanceProvider>
      </ColonyDecisionProvider>
    </ActionSidebarContextProvider>
  </ColonyContextProvider>
);

export default ColonyRoute;
