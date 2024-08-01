import React, { type FC, type PropsWithChildren } from 'react';

import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
import BasicSidebar from '~v5/common/Navigation/BasicSidebar/BasicSidebar.tsx';
import PageLayout from '~v5/frame/PageLayout/index.ts';

const displayName = 'frame.Extensions.layouts.MainLayout';

interface BasicPageLayoutProps extends PropsWithChildren {
  sidebar?: React.ReactNode;
}

const BasicPageLayout: FC<BasicPageLayoutProps> = ({ children, sidebar }) => {
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();

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
      }}
      sidebar={sidebar ?? <BasicSidebar />}
    >
      {children}
    </PageLayout>
  );
};

BasicPageLayout.displayName = displayName;

export default BasicPageLayout;
