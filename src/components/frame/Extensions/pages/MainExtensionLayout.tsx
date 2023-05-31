import React, { FC, PropsWithChildren } from 'react';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Header from './Header';

const displayName = 'common.Extensions.pages.MainExtensionLayout';

const MainExtensionLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-9">
        <div className="inner">{children}</div>
      </main>
    </div>
  );
};

MainExtensionLayout.displayName = displayName;

export default MainExtensionLayout;
