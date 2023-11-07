import React from 'react';
import { Outlet } from 'react-router-dom';

import { SharedLayout } from '~frame/Extensions/layouts';

const MainRoute = () => (
  <SharedLayout>
    <Outlet />
  </SharedLayout>
);

export default MainRoute;
