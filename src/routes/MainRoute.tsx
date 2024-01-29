import React from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from '~frame/Extensions/layouts/index.ts';

const MainRoute = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default MainRoute;
