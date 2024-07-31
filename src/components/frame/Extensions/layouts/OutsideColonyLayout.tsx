import React, { type FC, type PropsWithChildren } from 'react';

import { usePageHeadingContext } from '~context/PageHeadingContext/PageHeadingContext.ts';
import LandingPageSidebar from '~v5/common/Navigation/LandingPageSidebar/LandingPageSidebar.tsx';
import PageLayout from '~v5/frame/PageLayout/index.ts';

import { type MainLayoutProps } from './types.ts';

const displayName = 'frame.Extensions.layouts.MainLayout';

const OutsideColonyLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
}) => {
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
      sidebar={<LandingPageSidebar />}
    >
      {children}
    </PageLayout>
  );
};

OutsideColonyLayout.displayName = displayName;

export default OutsideColonyLayout;
