import React, { FC, PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import { usePageHeadingContext } from '~context';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
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
    <>
      <ToastContainer
        className={styles.toastNotification}
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
      />
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
    </>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
