import { useCallback, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { type CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

import type { UseCalamityBannerInfoReturnType } from './types.ts';

export const useCalamityBannerInfo = (): UseCalamityBannerInfoReturnType => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const handleUpgradeColony = useCallback(
    () =>
      toggleActionSidebarOn({
        [ACTION_TYPE_FIELD_NAME]: Action.UpgradeColonyVersion,
      }),
    [toggleActionSidebarOn],
  );

  const canUpgrade = canColonyBeUpgraded(colony, colonyContractVersion);

  const calamityBannerItems: CalamityBannerItemProps[] = useMemo(
    () => [
      {
        key: '1',
        linkProps: {
          to: 'https://docs.colony.io/use/advanced-features/upgrade-colony-and-extensions',
          text: formatText({ id: 'learn.more' }),
        },
        buttonProps: {
          onClick: handleUpgradeColony,
          text: formatText({ id: 'button.upgrade' }),
        },
        mode: 'info',
        title: formatText({ id: 'calamityBanner.available' }),
      },
    ],
    [handleUpgradeColony],
  );

  return {
    canUpgrade,
    calamityBannerItems,
  };
};
