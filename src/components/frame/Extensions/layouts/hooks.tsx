import React, { useCallback, useMemo } from 'react';

import { ColonyFragment } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useEnabledExtensions,
  useTransformer,
} from '~hooks';
import { getAllUserRoles } from '~transformers';
import { NetworkContractUpgradeDialog } from '~common/Dialogs';
import { useDialog } from '~shared/Dialog';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';
import { formatText } from '~utils/intl';
import { NavigationSidebarItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarMainMenu/types';
import { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';

import type { UseCalamityBannerInfoReturnType } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

export const useCalamityBannerInfo = (): UseCalamityBannerInfoReturnType => {
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

  const calamityBannerItems: CalamityBannerItemProps[] = useMemo(
    () => [
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
    ],
    [canUpgradeColony, handleUpgradeColony],
  );

  return {
    canUpgrade,
    calamityBannerItems,
  };
};

export const useMainMenuItems = () => {
  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();

  const mainMenuItems: NavigationSidebarItem[] = [
    {
      key: '1',
      iconName: 'layout',
      label: formatText({ id: 'navigation.dashboard' }) || '',
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.dashboard.title' }) || '',
        content: <p>content</p>,
        description: formatText({ id: 'navigation.dashboard.description' }),
        bottomActionProps: {
          text: formatText({ id: 'button.createNewAction' }),
          iconName: 'plus',
          onClick: () => toggleActionSideBar(),
        },
      },
    },
    {
      key: '2',
      iconName: 'user',
      label: formatText({ id: 'navigation.members' }) || '',
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.members.title' }) || '',
        content: <p>content</p>,
        description: formatText({ id: 'navigation.members.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: 'Members 1',
            href: '/',
          },
          {
            key: '2',
            label: 'Members 2',
          },
        ],
      },
    },
    {
      key: '3',
      iconName: 'bank',
      label: formatText({ id: 'navigation.finances' }) || '',
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.finances.title' }) || '',
        content: <p>content</p>,
        description: formatText({ id: 'navigation.finances.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: 'Finances 1',
            href: '/',
          },
          {
            key: '2',
            label: 'Finances 2',
          },
        ],
      },
    },
    {
      key: '4',
      iconName: 'handshake',
      label: formatText({ id: 'navigation.agreements' }) || '',
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.agreements.title' }) || '',
        content: <p>content</p>,
        description: formatText({ id: 'navigation.agreements.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: 'Agreements 1',
            href: '/',
          },
          {
            key: '2',
            label: 'Agreements 2',
          },
        ],
      },
    },
    {
      key: '5',
      iconName: 'gear-six',
      label: formatText({ id: 'navigation.admin' }) || '',
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.admin.title' }) || '',
        content: <p>content</p>,
        description: formatText({ id: 'navigation.admin.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: 'Admin 1',
            href: '/',
          },
          {
            key: '2',
            label: 'Admin 2',
          },
        ],
      },
    },
  ];

  return mainMenuItems;
};
