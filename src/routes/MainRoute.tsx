import React from 'react';
import { Outlet } from 'react-router-dom';

import {
  ColonyContextProvider,
  UserTransactionContextProvider,
} from '~context';
import { MemberModalProvider } from '~context/MemberModalContext';
import PageHeadingContextProvider from '~context/PageHeadingContext';
import { SharedLayout } from '~frame/Extensions/layouts';

const MainRoute = () => (
  <ColonyContextProvider>
    <MemberModalProvider>
      <UserTransactionContextProvider>
        <PageHeadingContextProvider>
          <SharedLayout>
            <Outlet />
          </SharedLayout>
        </PageHeadingContextProvider>
      </UserTransactionContextProvider>
    </MemberModalProvider>
  </ColonyContextProvider>
);

export default MainRoute;
