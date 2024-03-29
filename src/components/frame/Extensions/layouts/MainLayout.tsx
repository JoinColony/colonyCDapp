import React, { type FC, type PropsWithChildren } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
import PageLayout from '~v5/frame/PageLayout/index.ts';

import MainSidebar from './MainSidebar.tsx';
import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';
import SimpleSidebar from './SimpleSidebar.tsx';
import { type MainLayoutProps } from './types.ts';

const displayName = 'frame.Extensions.layouts.MainLayout';

const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
  sidebar,
  hasWideSidebar,
}) => {
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  const { wallet } = useAppContext();
  const Sidebar = sidebar || (wallet ? <MainSidebar /> : <SimpleSidebar />);

  return (
    <PageLayout
      headerProps={{
        pageHeadingProps:
          pageHeadingTitle || breadcrumbs.length
            ? {
                title: pageHeadingTitle,
                breadcrumbs,
              }
            : undefined,
        userNavigation: <UserNavigationWrapper />,
      }}
      sidebar={Sidebar}
      hasWideSidebar={hasWideSidebar}
    >
      {children}
    </PageLayout>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
