import React, { FC, PropsWithChildren } from 'react';
import Header from './Header';

const MainExtensionLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="lg:max-w-[74.375rem] px-6 mx-auto">{children}</main>
    </div>
  );
};

export default MainExtensionLayout;
