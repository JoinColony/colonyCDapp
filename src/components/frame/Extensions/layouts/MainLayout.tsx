import React, { FC, PropsWithChildren } from 'react';

import { usePageHeadingContext } from '~context';
import PageLayout from '~v5/frame/PageLayout';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { MainLayoutProps } from './types';
import MainSidebar from './MainSidebar';

const displayName = 'frame.Extensions.layouts.MainLayout';

const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
  sidebar,
  hasWideSidebar,
}) => {
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();
  const Sidebar = sidebar || <MainSidebar />;

  return (
    <PageLayout
      headerProps={{
        pageHeadingProps: pageHeadingTitle
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
