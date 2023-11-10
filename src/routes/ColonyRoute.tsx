import React from 'react';
import { Outlet } from 'react-router-dom';

import { ActionSidebarContextProvider } from '~context/ActionSidebarContext';
import { ColonyContextProvider } from '~context/ColonyContext';
import { ColonyDecisionProvider } from '~context/ColonyDecisionContext';
import { MemberModalProvider } from '~context/MemberModalContext';
import { TokensModalContextProvider } from '~context/TokensModalContext';
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
              <TokensModalContextProvider>
                <ColonyLayout>
                  <Outlet />
                </ColonyLayout>
              </TokensModalContextProvider>
            </UserTransactionContextProvider>
          </MemberModalProvider>
        </UserTokenBalanceProvider>
      </ColonyDecisionProvider>
    </ActionSidebarContextProvider>
  </ColonyContextProvider>
);

export default ColonyRoute;
