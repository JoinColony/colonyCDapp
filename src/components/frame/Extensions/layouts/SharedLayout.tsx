import React, { FC, PropsWithChildren, useLayoutEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { CREATE_COLONY_ROUTE } from '~routes';
import { useAppContext } from '~hooks';
import { usePageHeadingContext } from '~context';
import Logo from '~images/logo-new.svg';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { formatText } from '~utils/intl';
import PageLayout from '~v5/frame/PageLayout';
import { isBasicWallet } from '~types';
import { getLastWallet } from '~utils/autoLogin';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { SharedLayoutProps } from './types';
import ColonySwitcherContent from './partials/ColonySwitcherContent';

const displayName = 'frame.Extensions.layouts.SharedLayout';

const SharedLayout: FC<PropsWithChildren<SharedLayoutProps>> = ({
  children,
  mobileBottomContent,
  hamburgerLabel,
  mainMenuItems,
}) => {
  const { wallet, connectWallet } = useAppContext();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();

  useLayoutEffect(() => {
    if (
      (!wallet || isBasicWallet(wallet)) &&
      connectWallet &&
      getLastWallet()
    ) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

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
          mobileBottomContent,
          hamburgerLabel,
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
          mainMenuItems,
        }}
      >
        {children}
      </PageLayout>
    </>
  );
};

SharedLayout.displayName = displayName;

export default SharedLayout;
