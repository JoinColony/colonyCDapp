import { useCallback, useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import { canColonyBeUpgraded } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';
import { type CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

import type { UseCalamityBannerInfoReturnType } from './types.ts';

export const useCalamityBannerInfo = (): UseCalamityBannerInfoReturnType => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();

  const { showActionSidebar } = useActionSidebarContext();

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
          onClick: () =>
            showActionSidebar(ActionSidebarMode.CreateAction, {
              action: Action.UpgradeColonyVersion,
            }),
          text: formatText({ id: 'button.upgrade' }),
        },
        mode: 'info',
        title: formatText({ id: 'calamityBanner.available' }),
      },
    ],
    [showActionSidebar],
  );

  return {
    canUpgrade,
    calamityBannerItems,
  };
};
