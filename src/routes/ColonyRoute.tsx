import React from 'react';
import { Outlet } from 'react-router-dom';

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
import { ColonyLayout } from '~frame/Extensions/layouts';

const ColonyRoute = () => (
  <ColonyContextProvider>
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
  </ColonyContextProvider>
);

export default ColonyRoute;
