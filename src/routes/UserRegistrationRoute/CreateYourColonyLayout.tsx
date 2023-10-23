import React, { FC, PropsWithChildren } from 'react';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import { Header } from '~frame/Extensions/layouts';

import CreateYourColonySidebar from './CreateYourColonySidebar';

const CreateYourColonyLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-cols-[280px,auto] gap-4 p-4">
      <aside className="sticky top-4 h-[calc(100vh-2rem)]">
        <CreateYourColonySidebar />
      </aside>
      <div className="">
        <Header />
        <div className="hidden">
          <Wallet />
        </div>
        <main className="mt-5 pb-24">
          <div className="inner">
            <div className="mt-9 flex flex-col justify-center">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateYourColonyLayout;
