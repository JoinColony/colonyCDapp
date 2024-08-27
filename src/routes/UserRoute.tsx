import React from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import { AccountPageSidebar } from '~v5/shared/Navigation/Sidebar/sidebars/AccountPageSidebar/AccountPageSidebar.tsx';

const UserRoute = () => (
  <MainLayout sidebar={<AccountPageSidebar />}>
    <Outlet />
  </MainLayout>
);

export default UserRoute;
