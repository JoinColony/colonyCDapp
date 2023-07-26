import { useCallback } from 'react';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';
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

export const usePageLayout = () => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony as ColonyFragment,
    wallet?.address || '',
  ]);
  const openUpgradeColonyDialog = useDialog(NetworkContractUpgradeDialog);
  const enabledExtensionData = useEnabledExtensions();
  const canUpgradeColony = user?.name && hasRoot(allUserRoles);

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

  const calamityBannerItems: CalamityBannerItemProps[] = [
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
  ];

  return {
    calamityBannerItems,
    canUpgrade,
  };
};
