import {
  Bank,
  Check,
  FilePlus,
  GearSix,
  Layout,
  Plus,
  SpinnerGap,
  User,
  Buildings,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ACTION } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext.tsx';
import { useMobile } from '~hooks/index.ts';
import useColonyContractVersion from '~hooks/useColonyContractVersion.ts';
import useTransformer from '~hooks/useTransformer.ts';
import {
  COLONY_MEMBERS_ROUTE,
  COLONY_MULTISIG_ROUTE,
} from '~routes/routeConstants.ts';
import { getAllUserRoles } from '~transformers/index.ts';
import { canColonyBeUpgraded, hasRoot } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import { type NavigationSidebarItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarMainMenu/types.ts';
import { TxButton } from '~v5/shared/Button/index.ts';
import { type CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

import {
  adminMenu,
  // @BETA: Disabled for now
  // agreementsMenu,
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
    colony,
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
    colony: { metadata },
  } = useColonyContext();

  const {
    actionSidebarToggle: [
      ,
      { toggleOn: toggleActionSidebarOn, toggleOff: toggleActionSidebarOff },
    ],
  } = useActionSidebarContext();
  const { pathname } = useLocation();
  const nestedColonyPathname = pathname.split('/').slice(2).join('/');
  const handleNewActionClick = () => {
    if (hasTransactionId) {
      toggleActionSidebarOff();
      setTimeout(() => {
        toggleActionSidebarOn();
      }, 500);
    } else {
      toggleActionSidebarOn();
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
          onClick: () => toggleActionSidebarOn(),
        },
      },
    },
    {
      key: '3',
      icon: User,
      label: formatText({ id: 'navigation.members' }),
      isActive:
        checkIfIsActive(nestedColonyPathname, membersMenu) ||
        nestedColonyPathname === COLONY_MEMBERS_ROUTE,
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
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
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
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
              }),
          },
          {
            key: '4',
            label: formatText({ id: 'actions.createNewTeam' }),
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
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
              }),
          },
          // {
          //   key: '2',
          //   label: formatText({ id: 'actions.advancedPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.ADVANCED_PAYMENT,
          //     }),
          // },
          // {
          //   key: '3',
          //   label: formatText({ id: 'actions.streamingPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.STREAMING_PAYMENT,
          //     }),
          //   disabled: true,
          // },
          // {
          //   key: '4',
          //   label: formatText({ id: 'actions.splitPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.SPLIT_PAYMENT,
          //     }),
          // },
          // {
          //   key: '5',
          //   label: formatText({ id: 'actions.batchPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.BATCH_PAYMENT,
          //     }),
          //   disabled: true,
          // },
          // {
          //   key: '6',
          //   label: formatText({ id: 'actions.stagedPayment' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.STAGED_PAYMENT,
          //     }),
          //   disabled: true,
          // },
          {
            key: '7',
            label: formatText({ id: 'actions.transferFunds' }),
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
              }),
          },
          {
            key: '8',
            label: formatText({ id: 'actions.manageTokens' }),
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_TOKENS,
              }),
          },
          {
            key: '9',
            label: formatText({ id: 'actions.mintTokens' }),
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
              }),
          },
        ],
      },
    },
    // @BETA: Disabled for now
    // {
    //   key: '5',
    //   icon: Handshake,
    //   label: formatText({ id: 'navigation.agreements' }),
    //   isActive: checkIfIsActive(nestedColonyPathname, agreementsMenu),
    //   secondLevelMenuProps: {
    //     title: formatText({ id: 'navigation.agreements.title' }),
    //     content: agreementsMenu,
    //     description: formatText({ id: 'navigation.agreements.description' }),
    //   },
    //   relatedActionsProps: {
    //     title: formatText({ id: 'navigation.relatedActions' }),
    //     items: [
    //       {
    //         key: '1',
    //         label: formatText({ id: 'actions.createAgreement' }),
    //         onClick: () =>
    //           toggleActionSidebarOn({
    //             [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
    //           }),
    //       },
    //       {
    //         key: '2',
    //         label: formatText({ id: 'actions.simpleDiscussion' }),
    //         onClick: () =>
    //           toggleActionSidebarOn({
    //             [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_DISCUSSION,
    //           }),
    //       },
    //     ],
    //   },
    // },
    {
      key: '6',
      icon: GearSix,
      label: formatText({ id: 'navigation.admin' }),
      isActive: checkIfIsActive(nestedColonyPathname, [
        ...adminMenu,
        {
          key: '7',
          label: 'MultiSig',
          to: COLONY_MULTISIG_ROUTE,
          icon: Buildings,
        },
      ]),
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
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_COLONY_DETAILS,
              }),
          },
          {
            key: '2',
            label: formatText({ id: 'actions.upgradeColonyVersion' }),
            onClick: () =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.UPGRADE_COLONY_VERSION,
              }),
          },
          // @BETA: Disabled for now
          // {
          //   key: '3',
          //   label: formatText({ id: 'actions.enterRecoveryMode' }),
          //   onClick: () =>
          //     toggleActionSidebarOn({
          //       [ACTION_TYPE_FIELD_NAME]: ACTION.ENTER_RECOVERY_MODE,
          //     }),
          // },
          {
            key: '4',
            label: formatText({ id: 'actions.unlockToken' }),
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

export const useGetTxButtons = () => {
  const { groupState } = useUserTransactionContext();
  const isMobile = useMobile();

  const txButtons = (
    <>
      {groupState === TransactionGroupStates.SomePending && (
        <TxButton
          text={isMobile ? undefined : { id: 'button.pending' }}
          className={clsx({
            '!min-w-0': isMobile,
          })}
          icon={
            <span
              className={clsx('flex shrink-0', {
                'ml-1.5': !isMobile,
              })}
            >
              <SpinnerGap className="animate-spin" size={14} />
            </span>
          }
          data-openhubifclicked // see UserReputation for usage
        />
      )}
      {groupState === TransactionGroupStates.AllCompleted && (
        <TxButton
          text={isMobile ? undefined : { id: 'button.completed' }}
          className={clsx({
            '!min-w-0': isMobile,
          })}
          icon={
            <span
              className={clsx('flex shrink-0', {
                'ml-1.5': !isMobile,
              })}
            >
              <Check className="text-base-white" size={14} />
            </span>
          }
          data-openhubifclicked // see UserReputation for usage
        />
      )}
    </>
  );

  return txButtons;
};
