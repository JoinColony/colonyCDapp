import React, { FC, PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import { CREATE_COLONY_ROUTE } from '~routes';
import { useColonyContext } from '~hooks';
import { NETWORK_DATA } from '~constants';
import Logo from '~images/logo-new.svg';
import { useMemberModalContext } from '~context/MemberModalContext';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { formatText } from '~utils/intl';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import CalamityBanner from '~v5/shared/CalamityBanner';
import PageLayout from '~v5/frame/PageLayout';

import UserNavigationWrapper from './UserNavigationWrapper';
import { useCalamityBannerInfo } from './hooks';
import { SharedLayoutProps } from './types';

const displayName = 'frame.Extensions.layouts.SharedLayout';

const SharedLayout: FC<PropsWithChildren<SharedLayoutProps>> = ({
  children,
  mobileBottomContent,
  hamburgerLabel,
  mainMenuItems,
}) => {
  const { colony } = useColonyContext();

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

  const { calamityBannerItems, canUpgrade } = useCalamityBannerInfo();

  const { metadata, chainMetadata } = colony || {};
  const { chainId } = chainMetadata || {};

  const chainIcon = Object.values(NETWORK_DATA).find(
    ({ chainId: id }) => id === chainId,
  )?.iconName;

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
        // @todo: add context
        headerProps={{
          pageHeadingProps: {
            title: 'Members',
            breadcrumbs: [
              {
                key: '1',
                label: 'Metacolony',
                href: '/',
              },
              {
                key: '2',
                dropdownOptions: [
                  {
                    label: 'All teams',
                    href: '/all-teams',
                  },
                ],
                selectedValue: '/all-teams',
              },
            ],
          },
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
              // @todo: add colony switcher content
              content: <p>colony</p>,
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
