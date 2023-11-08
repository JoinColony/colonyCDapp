import React, { FC, PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import { CREATE_COLONY_ROUTE } from '~routes';
import { usePageHeadingContext } from '~context';
import Logo from '~images/logo-new.svg';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { formatText } from '~utils/intl';
import PageLayout from '~v5/frame/PageLayout';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { MainLayoutProps } from './types';
import ColonySwitcherContent from './partials/ColonySwitcherContent';

const displayName = 'frame.Extensions.layouts.MainLayout';

const MainLayout: FC<PropsWithChildren<MainLayoutProps>> = ({ children }) => {
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();

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
        navigationSidebarProps={{
          logo: <Logo />,
          additionalMobileContent: <UserNavigationWrapper />,
          colonySwitcherProps: {
            avatarProps: {},
            content: {
              title:
                formatText({ id: 'navigation.colonySwitcher.title' }) || '',
              content: <ColonySwitcherContent />,
              bottomActionProps: {
                text: formatText({ id: 'button.createNewColony' }),
                iconName: 'plus',
                to: CREATE_COLONY_ROUTE,
              },
            },
          },
        }}
      >
        {children}
      </PageLayout>
    </>
  );
};

MainLayout.displayName = displayName;

export default MainLayout;
