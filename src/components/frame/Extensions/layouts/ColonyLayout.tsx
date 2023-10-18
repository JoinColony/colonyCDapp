import React, { FC, PropsWithChildren, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';

import Wallet from '~frame/RouteLayouts/UserNavigation/Wallet';
import Navigation from '~v5/common/Navigation';
import PageTitle from '~v5/common/PageTitle';
import CalamityBanner from '~v5/shared/CalamityBanner';
import Spinner from '~v5/shared/Spinner';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';
import { ColonyFragment } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useMobile,
  useTransformer,
} from '~hooks';
import { useDialog } from '~shared/Dialog';
import { getAllUserRoles } from '~transformers';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';

import type { MainLayoutProps } from './types';

import ColonyHeader from './ColonyHeader';
import MainSidebar from './MainSidebar';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

const ColonyLayout: FC<PropsWithChildren<MainLayoutProps>> = ({
  children,
  title,
  description,
  loadingText,
  pageName,
}) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony as ColonyFragment,
    wallet?.address || '',
  ]);
  const openUpgradeColonyDialog = useDialog(NetworkContractUpgradeDialog);
  const enabledExtensionData = useEnabledExtensions();
  const canUpgradeColony = user?.profile?.displayName && hasRoot(allUserRoles);

  const handleUpgradeColony = useCallback(
    () =>
      colony &&
      openUpgradeColonyDialog({
        colony,
        enabledExtensionData,
      }),
    [colony, enabledExtensionData, openUpgradeColonyDialog],
  );

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  const calamityBannerItems: CalamityBannerItemProps[] = canUpgrade
    ? [
        {
          id: '1',
          linkUrl:
            'https://docs.colony.io/use/advanced-features/upgrade-colony-and-extensions',
          buttonName: 'button.upgrade',
          linkName: 'learn.more',
          isButtonDisabled: !canUpgradeColony,
          mode: 'info',
          onClick: handleUpgradeColony,
          title: { id: 'calamityBanner.available' },
        },
      ]
    : [];

  return (
    <Spinner loading={false} loadingText={loadingText}>
      <CalamityBanner items={calamityBannerItems} />
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
      <MainSidebar colony={colony} />
      <ColonyHeader />
      {/* @TODO: Remove wallet component when we have a proper wallet */}
      <div className="hidden">
        <Wallet />
      </div>
      <main className="mt-5 pb-24">
        <div className="inner">
          {isMobile && (
            <div className="mb-9">
              <Navigation pageName={pageName} />
            </div>
          )}
          <PageTitle title={title} subtitle={description} />
          <div className="mt-9">{children}</div>
        </div>
      </main>
    </Spinner>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
