import React, { FC, PropsWithChildren } from 'react';

import { usePageHeadingContext } from '~context';
import { useAppContext } from '~hooks';
import PageLayout from '~v5/frame/PageLayout';

import MainSidebar from './MainSidebar';
import UserNavigationWrapper from './partials/UserNavigationWrapper';
import SimpleSidebar from './SimpleSidebar';
import { MainLayoutProps } from './types';

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
