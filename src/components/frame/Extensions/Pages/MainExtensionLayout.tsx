import React, { FC, PropsWithChildren } from 'react';
import Header from './Header';
import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';

const displayName = 'common.Extensions.Pages.MainExtensionLayout';

const MainExtensionLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="lg:max-w-[74.375rem] px-6 mx-auto">{children}</main>
    </div>
  );
};

MainExtensionLayout.displayName = displayName;

export default MainExtensionLayout;
