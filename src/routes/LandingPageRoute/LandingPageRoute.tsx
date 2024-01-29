import React from 'react';
import { Outlet } from 'react-router-dom';

import { useAppContext } from '~context/AppContext.tsx';
import { MainLayout, MainSidebar } from '~frame/Extensions/layouts/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import SimpleSidebar from '~v5/shared/SimpleSidebar/index.ts';

const LandingPageRoute = () => {
  const { user, userLoading, walletConnecting } = useAppContext();

  if (userLoading || walletConnecting) {
    return <LoadingTemplate />;
  }

  return (
    <MainLayout sidebar={user ? <MainSidebar /> : <SimpleSidebar />}>
      <Outlet />
    </MainLayout>
  );
};

export default LandingPageRoute;
