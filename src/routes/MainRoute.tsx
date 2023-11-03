import React from 'react';
import { Outlet } from 'react-router-dom';

import {
  ColonyContextProvider,
  UserTransactionContextProvider,
} from '~context';
import { MemberModalProvider } from '~context/MemberModalContext';
import { SharedLayout } from '~frame/Extensions/layouts';

const MainRoute = () => (
  <ColonyContextProvider>
    <MemberModalProvider>
      <UserTransactionContextProvider>
        <SharedLayout>
          <Outlet />
        </SharedLayout>
      </UserTransactionContextProvider>
    </MemberModalProvider>
  </ColonyContextProvider>
);

export default MainRoute;
