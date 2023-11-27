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
import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';

const ColonyRoute = () => (
  <ColonyContextProvider>
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

export default ColonyRoute;
