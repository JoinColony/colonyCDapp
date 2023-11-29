import React from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout, MainSidebar } from '~frame/Extensions/layouts';
import { useAppContext } from '~hooks';
import SimpleSidebar from '~v5/shared/SimpleSidebar';

const LandingPageRoute = () => {
  const { user } = useAppContext();
  return (
    <MainLayout sidebar={user ? <MainSidebar /> : <SimpleSidebar />}>
      <Outlet />
    </MainLayout>
  );
};

export default LandingPageRoute;
