import React from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from '~frame/Extensions/layouts';

const MainRoute = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default MainRoute;
