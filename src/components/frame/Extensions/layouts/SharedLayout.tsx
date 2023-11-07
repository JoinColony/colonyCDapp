import React, { FC, PropsWithChildren, useLayoutEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { CREATE_COLONY_ROUTE } from '~routes';
import { useAppContext, useColonyContext } from '~hooks';
import Logo from '~images/logo-new.svg';
import { useMemberModalContext } from '~context/MemberModalContext';
import usePageHeadingContext from '~context/PageHeadingContext/hooks';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { formatText } from '~utils/intl';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import CalamityBanner from '~v5/shared/CalamityBanner';
import PageLayout from '~v5/frame/PageLayout';
import { isBasicWallet } from '~types';
import { getLastWallet } from '~utils/autoLogin';

import UserNavigationWrapper from './partials/UserNavigationWrapper';
import { useCalamityBannerInfo } from './hooks';
import { SharedLayoutProps } from './types';
import ColonySwitcherContent from './partials/ColonySwitcherContent';
import { getChainIconName } from './utils';

const displayName = 'frame.Extensions.layouts.SharedLayout';

const SharedLayout: FC<PropsWithChildren<SharedLayoutProps>> = ({
  children,
  mobileBottomContent,
  hamburgerLabel,
  mainMenuItems,
}) => {
  const { wallet, connectWallet } = useAppContext();
  const { colony } = useColonyContext();
  const { title: pageHeadingTitle, breadcrumbs = [] } = usePageHeadingContext();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const { calamityBannerItems, canUpgrade } = useCalamityBannerInfo();

  const { metadata, chainMetadata } = colony || {};
  const { chainId } = chainMetadata || {};

  const chainIcon = getChainIconName(chainId);

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
        topContent={
          canUpgrade ? (
            <CalamityBanner items={calamityBannerItems} />
          ) : undefined
        }
        headerProps={{
          pageHeadingProps: pageHeadingTitle
            ? {
                title: pageHeadingTitle,
                breadcrumbs: [
                  ...(colony?.name
                    ? [
                        {
                          key: '1',
                          href: `/colony/${colony?.name}`,
                          label: colony?.name,
                        },
                      ]
                    : []),
                  ...breadcrumbs,
                ],
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
            avatarProps: {
              colonyImageProps: metadata?.avatar
                ? { src: metadata?.thumbnail || metadata?.avatar }
                : undefined,
              chainIconName: chainIcon,
            },
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
      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </>
  );
};

SharedLayout.displayName = displayName;

export default SharedLayout;
