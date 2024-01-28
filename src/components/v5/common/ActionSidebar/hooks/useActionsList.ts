import { useMemo } from 'react';

// @BETA: Disabled for now
// import { ColonyRole } from '@colony/colony-js';

import { ACTION } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useUserAccountRegistered } from '~hooks/useCanInteractWithColony.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { getAllUserRoles } from '~transformers/index.ts';
import {
  canAdminister,
  canArchitect,
  // @BETA: Disabled for now
  // canEnterRecoveryMode,
  canFund,
  hasRoot,
  // @BETA: Disabled for now
  // userHasRole,
} from '~utils/checks/index.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

export const useActionsList = () => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const enabledExtensionData = useEnabledExtensions();
  const { isVotingReputationEnabled, isOneTxPaymentEnabled } =
    enabledExtensionData;

  const userHasAccountRegistered = useUserAccountRegistered();

  const allUserRoles = getAllUserRoles(colony, wallet?.address || '');

  const hasRootPermission = userHasAccountRegistered && hasRoot(allUserRoles);

  // @BETA: Disabled for now
  // const canEnterRecovery =
  //   userHasAccountRegistered && canEnterRecoveryMode(allUserRoles);
  const canEnterPermissionManagement =
    (userHasAccountRegistered && canArchitect(allUserRoles)) ||
    hasRootPermission;
  const canCreateEditDomain =
    userHasAccountRegistered && canArchitect(allUserRoles);
  const canCreatePayment =
    userHasAccountRegistered &&
    ((canAdminister(allUserRoles) && canFund(allUserRoles)) ||
      isVotingReputationEnabled);
  const canMoveFunds = canFund(allUserRoles);
  const canUserMintNativeToken = isVotingReputationEnabled
    ? colony.status?.nativeToken?.mintable
    : hasRoot(allUserRoles) && colony.status?.nativeToken?.mintable;
  const canUserUnlockNativeToken = isVotingReputationEnabled
    ? colony.status?.nativeToken?.unlockable
    : hasRoot(allUserRoles) && colony.status?.nativeToken?.unlockable;
  const canManageTokens = hasRoot(allUserRoles);
  // @BETA: Disabled for now
  // const canSmiteReputation =
  //   userHasAccountRegistered &&
  //   (userHasRole(allUserRoles, ColonyRole.Arbitration) ||
  //     isVotingReputationEnabled);
  // const canAwardReputation =
  //   userHasAccountRegistered &&
  //   (userHasRole(allUserRoles, ColonyRole.Root) || isVotingReputationEnabled);

  return useMemo(
    (): SearchSelectOptionProps[] => [
      {
        key: '1',
        title: { id: 'actions.payments' },
        isAccordion: true,
        options: [
          {
            label: { id: 'actions.simplePayment' },
            value: ACTION.SIMPLE_PAYMENT,
            missingPermissions:
              !canCreatePayment || !isOneTxPaymentEnabled
                ? 'actionSidebar.missingPermissions.payment'
                : undefined,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.advancedPayment' },
          //   value: ACTION.ADVANCED_PAYMENT,
          //   isDisabled: true,
          // },
          // {
          //   label: { id: 'actions.batchPayment' },
          //   value: ACTION.BATCH_PAYMENT,
          //   isDisabled: true,
          // },
          // {
          //   label: { id: 'actions.splitPayment' },
          //   value: ACTION.SPLIT_PAYMENT,
          //   isDisabled: true,
          // },
          // {
          //   label: { id: 'actions.stagedPayment' },
          //   value: ACTION.STAGED_PAYMENT,
          //   isDisabled: true,
          // },
          // {
          //   label: { id: 'actions.streamingPayment' },
          //   value: ACTION.STREAMING_PAYMENT,
          //   isDisabled: true,
          // },
        ],
      },
      {
        key: '2',
        isAccordion: true,
        title: { id: 'actions.decisions' },
        options: [
          {
            label: { id: 'actions.createDecision' },
            value: ACTION.CREATE_DECISION,
            isDisabled: false,
          },
        ],
      },
      {
        key: '3',
        isAccordion: true,
        title: { id: 'actions.funds' },
        options: [
          {
            label: { id: 'actions.transferFunds' },
            value: ACTION.TRANSFER_FUNDS,
            missingPermissions:
              !userHasAccountRegistered ||
              !(canMoveFunds || isVotingReputationEnabled)
                ? 'actionSidebar.missingPermissions.funds'
                : undefined,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: ACTION.MINT_TOKENS,
            missingPermissions:
              !userHasAccountRegistered || !canUserMintNativeToken
                ? 'actionSidebar.missingPermissions.root'
                : undefined,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: ACTION.UNLOCK_TOKEN,
            missingPermissions:
              !userHasAccountRegistered || !canUserUnlockNativeToken
                ? 'actionSidebar.missingPermissions.root'
                : undefined,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: ACTION.MANAGE_TOKENS,
            missingPermissions:
              !userHasAccountRegistered ||
              !(canManageTokens || isVotingReputationEnabled)
                ? 'actionSidebar.missingPermissions.root'
                : undefined,
          },
        ],
      },
      {
        key: '4',
        isAccordion: true,
        title: { id: 'actions.teams' },
        options: [
          {
            label: { id: 'actions.createNewTeam' },
            value: ACTION.CREATE_NEW_TEAM,
            missingPermissions: !(
              canCreateEditDomain || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.teams'
              : undefined,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: ACTION.EDIT_EXISTING_TEAM,
            missingPermissions: !(
              canCreateEditDomain || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.teams'
              : undefined,
          },
        ],
      },
      {
        key: '5',
        isAccordion: true,
        title: { id: 'actions.admin' },
        options: [
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.manageReputation' },
          //   value: ACTION.MANAGE_REPUTATION,
          //   missingPermissions:
          //     !canAwardReputation || !canSmiteReputation
          //       ? 'actionSidebar.missingPermissions.manageReputation'
          //       : undefined,
          // },
          {
            label: { id: 'actions.managePermissions' },
            value: ACTION.MANAGE_PERMISSIONS,
            missingPermissions: !(
              canEnterPermissionManagement || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.permissions'
              : undefined,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: ACTION.EDIT_COLONY_DETAILS,
            missingPermissions: !(
              hasRootPermission || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.root'
              : undefined,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: ACTION.UPGRADE_COLONY_VERSION,
            missingPermissions: !(
              hasRootPermission || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.root'
              : undefined,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: ACTION.ENTER_RECOVERY_MODE,
          //   missingPermissions: !canEnterRecovery
          //     ? 'actionSidebar.missingPermissions.recovery'
          //     : undefined,
          // },
          {
            label: { id: 'actions.manageColonyObjectives' },
            value: ACTION.MANAGE_COLONY_OBJECTIVES,
          },
          // {
          //   label: { id: 'actions.createNewIntegration' },
          //   value: ACTION.CREATE_NEW_INTEGRATION,
          //   isDisabled: true,
          // },
        ],
      },
    ],
    [
      // @BETA: Disabled for now
      // canAwardReputation,
      canCreateEditDomain,
      canCreatePayment,
      canEnterPermissionManagement,
      // @BETA: Disabled for now
      // canEnterRecovery,
      canManageTokens,
      canMoveFunds,
      // @BETA: Disabled for now
      // canSmiteReputation,
      canUserMintNativeToken,
      canUserUnlockNativeToken,
      hasRootPermission,
      isOneTxPaymentEnabled,
      isVotingReputationEnabled,
      userHasAccountRegistered,
    ],
  );
};
