import React from 'react';
import { Outlet } from 'react-router-dom';

// import { MainLayout } from '~frame/Extensions/layouts';

const MainRoute = () => (
  <div>
    <Outlet />
  </div>
);

export default MainRoute;
