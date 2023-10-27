import React, { FC, PropsWithChildren, useCallback } from 'react';

import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import { useMemberModalContext } from '~context/MemberModalContext';
import { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import { ColonyFragment } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useTransformer,
} from '~hooks';
import { useDialog } from '~shared/Dialog';
import { getAllUserRoles } from '~transformers';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';

import type { ColonyLayoutProps } from './types';

import MainLayout from './MainLayout';
import ColonyHeader from './ColonyHeader';
import MainSidebar from './MainSidebar';

const displayName = 'frame.Extensions.layouts.ColonyLayout';

const ColonyLayout: FC<PropsWithChildren<ColonyLayoutProps>> = (props) => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony as ColonyFragment,
    wallet?.address || '',
  ]);

  const {
    isMemberModalOpen,
    setIsMemberModalOpen,
    user: modalUser,
  } = useMemberModalContext();

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

  const header = <ColonyHeader />;
  const sidebar = <MainSidebar colony={colony} />;

  return (
    <>
      <MainLayout
        {...props}
        calamityBannerItems={calamityBannerItems}
        header={header}
        sidebar={sidebar}
      />

      <ManageMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        user={modalUser}
      />
    </>
  );
};

ColonyLayout.displayName = displayName;

export default ColonyLayout;
