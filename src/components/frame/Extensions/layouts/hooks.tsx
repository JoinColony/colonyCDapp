import React, { useCallback, useMemo } from 'react';
import { useMatch } from 'react-router-dom';

import { ColonyFragment } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useColonyContractVersion,
  useTransformer,
} from '~hooks';
import { COLONY_HOME_ROUTE } from '~routes';
import { getAllUserRoles } from '~transformers';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { formatText } from '~utils/intl';
import { ACTION } from '~constants/actions';
import { NavigationSidebarItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarMainMenu/types';
import { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import type { UseCalamityBannerInfoReturnType } from './types';
import {
  adminMenu,
  agreementsMenu,
  dashboardMainMenu,
  dashboardMenu,
  financesMenu,
  membersMenu,
} from './consts';
import { checkIfIsActive } from './utils';
import DashboardContent from './partials/DashboardContent';

export const useCalamityBannerInfo = (): UseCalamityBannerInfoReturnType => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony as ColonyFragment,
    wallet?.address || '',
  ]);

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const canUpgradeColony = user?.profile?.displayName && hasRoot(allUserRoles);

  const handleUpgradeColony = useCallback(
    () =>
      toggleActionSidebarOn({
        [ACTION_TYPE_FIELD_NAME]: ACTION.UPGRADE_COLONY_VERSION,
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
          text: formatText({ id: 'learn.more' }) || '',
        },
        buttonProps: {
          onClick: handleUpgradeColony,
          text: formatText({ id: 'button.upgrade' }) || '',
          disabled: !canUpgradeColony,
        },
        mode: 'info',
        title: formatText({ id: 'calamityBanner.available' }) || '',
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
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const { params: { '*': currentPathname = undefined } = {} } =
    useMatch(COLONY_HOME_ROUTE) || {};

  // @todo: update menu items with correct contents and related actions
  const mainMenuItems: NavigationSidebarItem[] = [
    {
      key: '1',
      iconName: 'file-plus',
      label: formatText({ id: 'navigation.newAction' }) || '',
      onClick: () => toggleActionSidebarOn(),
      hideMobile: true,
    },
    {
      key: '2',
      iconName: 'layout',
      label: formatText({ id: 'navigation.dashboard' }) || '',
      isActive: checkIfIsActive(currentPathname, [
        ...dashboardMainMenu,
        ...dashboardMenu,
      ]),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.dashboard.title' }) || '',
        content: <DashboardContent />,
        description: formatText({ id: 'navigation.dashboard.description' }),
        bottomActionProps: {
          text: formatText({ id: 'button.createNewAction' }),
          iconName: 'plus',
          onClick: () => toggleActionSidebarOn(),
        },
      },
    },
    {
      key: '3',
      iconName: 'user',
      label: formatText({ id: 'navigation.members' }) || '',
      isActive: checkIfIsActive(currentPathname, membersMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.members.title' }) || '',
        content: membersMenu,
        description: formatText({ id: 'navigation.members.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.managePermissions' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.manageReputation' }) || '',
            // @todo: update action type when manage reputation is implemented
            onClick: () => {},
          },
          {
            key: '3',
            label: formatText({ id: 'actions.editExistingTeam' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
              }),
          },
          {
            key: '4',
            label: formatText({ id: 'actions.createNewTeam' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
              }),
          },
        ],
      },
    },
    {
      key: '4',
      iconName: 'bank',
      label: formatText({ id: 'navigation.finances' }) || '',
      isActive: checkIfIsActive(currentPathname, financesMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.finances.title' }) || '',
        content: financesMenu,
        description: formatText({ id: 'navigation.finances.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.simplePayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.advancedPayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.ADVANCED_PAYMENT,
              }),
          },
          {
            key: '3',
            label: formatText({ id: 'actions.streamingPayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.STREAMING_PAYMENT,
              }),
            disabled: true,
          },
          {
            key: '4',
            label: formatText({ id: 'actions.splitPayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.SPLIT_PAYMENT,
              }),
          },
          {
            key: '5',
            label: formatText({ id: 'actions.batchPayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.BATCH_PAYMENT,
              }),
            disabled: true,
          },
          {
            key: '6',
            label: formatText({ id: 'actions.stagedPayment' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.STAGED_PAYMENT,
              }),
            disabled: true,
          },
          {
            key: '7',
            label: formatText({ id: 'actions.transferFunds' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
              }),
          },
          {
            key: '8',
            label: formatText({ id: 'actions.manageTokens' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_TOKENS,
              }),
          },
          {
            key: '9',
            label: formatText({ id: 'actions.mintTokens' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
              }),
          },
        ],
      },
    },
    {
      key: '5',
      iconName: 'handshake',
      label: formatText({ id: 'navigation.agreements' }) || '',
      isActive: checkIfIsActive(currentPathname, agreementsMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.agreements.title' }) || '',
        content: agreementsMenu,
        description: formatText({ id: 'navigation.agreements.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.createAgreement' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.simpleDiscussion' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_DISCUSSION,
              }),
          },
        ],
      },
    },
    {
      key: '6',
      iconName: 'gear-six',
      label: formatText({ id: 'navigation.admin' }) || '',
      isActive: checkIfIsActive(currentPathname, adminMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.admin.title' }) || '',
        content: adminMenu,
        description: formatText({ id: 'navigation.admin.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.editColonyDetails' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_COLONY_DETAILS,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.upgradeColonyVersion' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.UPGRADE_COLONY_VERSION,
              }),
          },
          {
            key: '3',
            label: formatText({ id: 'actions.enterRecoveryMode' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.ENTER_RECOVERY_MODE,
              }),
          },
          {
            key: '4',
            label: formatText({ id: 'actions.unlockToken' }) || '',
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.UNLOCK_TOKEN,
              }),
          },
        ],
      },
    },
  ];

  return mainMenuItems;
};
