import React, { FC, PropsWithChildren } from 'react';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import { Header, MainSidebar } from '~frame/Extensions/layouts';
import { useAppContext } from '~hooks';

import SimpleSidebar from './SimpleSidebar';

const displayName = 'routes.LandingPageRoute.LandingPageLayout';

const LandingPageLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAppContext();

  return (
    <div className="grid grid-cols-[80px,auto] gap-8 p-4">
      <aside className="sticky top-4 h-[calc(100vh-2rem)]">
        {user ? <MainSidebar /> : <SimpleSidebar />}
      </aside>
      <div className="flex flex-col items-center w-full">
        <Header />
        {/* @TODO: Remove wallet component when we have a proper wallet */}
        <div className="hidden">
          <Wallet />
        </div>
        <main className="w-full mt-9 pr-4 flex flex-col items-center justify-center max-w-[1444px]">
          {children}
        </main>
      </div>
    </div>
  );
};
LandingPageLayout.displayName = displayName;

export default LandingPageLayout;
