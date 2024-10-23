import React, { type FC, type PropsWithChildren } from 'react';

import PageLayout from '~v5/frame/PageLayout/index.ts';
import { BasicPageSidebar } from '~v5/shared/Navigation/Sidebar/sidebars/BasicPageSidebar.tsx';

import UserNavigationWrapper from './partials/UserNavigationWrapper/index.ts';
import { type MainLayoutProps } from './types.ts';

const displayName = 'frame.Extensions.layouts.MainLayout';

/** TODO: This should not be under the Extensions directory */
const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
  sidebar,
  header,
}) => {
  return (
    <PageLayout
      headerProps={{
        userNavigation: <UserNavigationWrapper />,
      }}
      sidebar={sidebar ?? <BasicPageSidebar />}
      header={header}
    >
      {children}
    </PageLayout>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
