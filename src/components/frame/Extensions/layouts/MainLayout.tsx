import React, { type FC, type PropsWithChildren } from 'react';

import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
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
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();

  return (
    <PageLayout
      // @TODO: Move page heading props logic inside the header component itself
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
      sidebar={sidebar ?? <BasicPageSidebar />}
      header={header}
    >
      {children}
    </PageLayout>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
