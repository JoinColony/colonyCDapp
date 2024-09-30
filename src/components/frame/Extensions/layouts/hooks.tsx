import {
  Bank,
  FilePlus,
  GearSix,
  Layout,
  Plus,
  User,
  Buildings,
  Handshake,
} from '@phosphor-icons/react';
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ActionCore } from '~actions/core/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useTransformer from '~hooks/useTransformer.ts';
import {
  COLONY_MEMBERS_ROUTE,
  COLONY_MULTISIG_ROUTE,
} from '~routes/routeConstants.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks/index.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { type NavigationSidebarItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarMainMenu/types.ts';
import { type CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

import {
  adminMenu,
  agreementsMenu,
  dashboardMainMenu,
  dashboardMenu,
  financesMenu,
  membersMenu,
} from './consts.ts';
import DashboardContent from './partials/DashboardContent/index.ts';
import { checkIfIsActive } from './utils.ts';

import type { UseCalamityBannerInfoReturnType } from './types.ts';

export const useCalamityBannerInfo = (): UseCalamityBannerInfoReturnType => {
  const { colony } = useColonyContext();
  const { colonyContractVersion } = useColonyContractVersion();
  const { user, wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    extractColonyRoles(colony.roles),
    wallet?.address || '',
  ]);

  const { show } = useActionSidebarContext();

  const canUpgradeColony = user?.profile?.displayName && hasRoot(allUserRoles);

  const handleUpgradeColony = useCallback(
    () =>
      show({
        [ACTION_TYPE_FIELD_NAME]: ActionCore.UpgradeColonyVersion,
      }),
    [show],
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
          disabled: !canUpgradeColony,
        },
        mode: 'info',
        title: formatText({ id: 'calamityBanner.available' }),
      },
    ],
    [canUpgradeColony, handleUpgradeColony],
  );

  return {
    canUpgrade,
    calamityBannerItems,
  };
};

export const useMainMenuItems = (hasTransactionId: boolean) => {
  const {
    colony: { metadata, status },
  } = useColonyContext();

  const { hide, show } = useActionSidebarContext();
  const { pathname } = useLocation();
  const nestedColonyPathname = pathname.split('/').slice(2).join('/');
  const handleNewActionClick = () => {
    if (hasTransactionId) {
      hide();
      setTimeout(() => {
        show();
      }, 500);
    } else {
      show();
    }
  };

  // @todo: update menu items with correct contents and related actions
  const mainMenuItems: NavigationSidebarItem[] = [
    {
      key: '1',
      icon: FilePlus,
      label: formatText({ id: 'navigation.newAction' }),
      onClick: handleNewActionClick,
      hideMobile: true,
      isHighlighted: true,
    },
    {
      key: '2',
      icon: Layout,
      label: formatText({ id: 'navigation.dashboard' }),
      isActive: checkIfIsActive(nestedColonyPathname, [
        ...dashboardMainMenu,
        ...dashboardMenu,
      ]),
      secondLevelMenuProps: {
        title: metadata?.displayName || '',
        content: <DashboardContent />,
        description: metadata?.description || '',
        bottomActionProps: {
          text: formatText({ id: 'button.createNewAction' }),
          icon: Plus,
          onClick: () => show(),
        },
      },
    },
    {
      key: '3',
      icon: User,
      label: formatText({ id: 'navigation.members' }),
      isActive:
        checkIfIsActive(nestedColonyPathname, [
          ...membersMenu,
          {
            key: '7',
            label: 'MultiSig',
            to: COLONY_MULTISIG_ROUTE,
            icon: Buildings,
          },
        ]) || nestedColonyPathname === COLONY_MEMBERS_ROUTE,
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.members.title' }),
        content: membersMenu,
        description: formatText({ id: 'navigation.members.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.managePermissions' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.ManagePermissions,
              }),
          },
          // @BETA: Disabled for now
          // {
          //   key: '2',
          //   label: formatText({ id: 'actions.manageReputation' }),
          //   // @todo: update action type when manage reputation is implemented
          //   onClick: () => {},
          // },
          {
            key: '3',
            label: formatText({ id: 'actions.editExistingTeam' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.EditTeam,
              }),
          },
          {
            key: '4',
            label: formatText({ id: 'actions.createNewTeam' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.CreateTeam,
              }),
          },
        ],
      },
    },
    {
      key: '4',
      icon: Bank,
      label: formatText({ id: 'navigation.finances' }),
      isActive: checkIfIsActive(nestedColonyPathname, financesMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.finances.title' }),
        content: financesMenu,
        description: formatText({ id: 'navigation.finances.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.simplePayment' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.SimplePayment,
              }),
          },
          // {
          //   key: '2',
          //   label: formatText({ id: 'actions.paymentBuilder' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.PaymentBuilder,
          //     }),
          // },
          // {
          //   key: '3',
          //   label: formatText({ id: 'actions.streamingPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.StreamingPayment,
          //     }),
          //   disabled: true,
          // },
          // {
          //   key: '4',
          //   label: formatText({ id: 'actions.splitPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.SplitPayment,
          //     }),
          // },
          // {
          //   key: '5',
          //   label: formatText({ id: 'actions.batchPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.BatchPayment,
          //     }),
          //   disabled: true,
          // },
          // {
          //   key: '6',
          //   label: formatText({ id: 'actions.stagedPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.StagedPayment,
          //     }),
          //   disabled: true,
          // },
          {
            key: '7',
            label: formatText({ id: 'actions.transferFunds' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.TransferFunds,
              }),
          },
          {
            key: '8',
            label: formatText({ id: 'actions.manageTokens' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.ManageTokens,
              }),
          },
        ],
      },
    },
    {
      key: '5',
      icon: Handshake,
      label: formatText({ id: 'navigation.agreements' }),
      isActive: checkIfIsActive(nestedColonyPathname, agreementsMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.agreements.title' }),
        content: agreementsMenu,
        description: formatText({ id: 'navigation.agreements.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.createAgreement' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.CreateDecision,
              }),
          },
          // {
          //   key: '2',
          //   label: formatText({ id: 'actions.simpleDiscussion' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.SimpleDiscussion,
          //     }),
          // },
        ],
      },
    },
    {
      key: '6',
      icon: GearSix,
      label: formatText({ id: 'navigation.admin' }),
      isActive: checkIfIsActive(nestedColonyPathname, adminMenu),
      secondLevelMenuProps: {
        title: formatText({ id: 'navigation.admin.title' }),
        content: adminMenu,
        description: formatText({ id: 'navigation.admin.description' }),
      },
      relatedActionsProps: {
        title: formatText({ id: 'navigation.relatedActions' }),
        items: [
          {
            key: '1',
            label: formatText({ id: 'actions.editColonyDetails' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.EditColonyDetails,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.upgradeColonyVersion' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.UpgradeColonyVersion,
              }),
          },
          // @BETA: Disabled for now
          // {
          //   key: '3',
          //   label: formatText({ id: 'actions.enterRecoveryMode' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: Action.EnterRecoveryMode,
          //     }),
          // },
          {
            key: '4',
            label: formatText({ id: 'actions.unlockToken' }),
            onClick: () =>
              show({
                [ACTION_TYPE_FIELD_NAME]: ActionCore.UnlockToken,
              }),
          },
        ],
      },
    },
  ];

  if (status?.nativeToken?.mintable) {
    mainMenuItems[3].relatedActionsProps?.items?.push({
      key: '9',
      label: formatText({ id: 'actions.mintTokens' }),
      onClick: () =>
        show({
          [ACTION_TYPE_FIELD_NAME]: ActionCore.MintTokens,
        }),
    });
  }

  return mainMenuItems;
};
