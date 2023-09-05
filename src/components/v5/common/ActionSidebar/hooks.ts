import { useMemo } from 'react';

import { ColonyRole } from '@colony/colony-js';
import { Actions } from '~constants/actions';
import {
  useAppContext,
  useColonyContext,
  useColonyHasReputation,
  useDialogActionPermissions,
  useEnabledExtensions,
  useTransformer,
  useUserAccountRegistered,
} from '~hooks';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import { Colony } from '~types';
import { getAllUserRoles } from '~transformers';
import SinglePaymentForm from './partials/SinglePaymentForm';
import MintTokenForm from './partials/MintTokenForm';
import TransferFundsForm from './partials/TransferFundsForm';
import CreateNewTeamForm from './partials/CreateNewTeamForm';
import UnlockTokenForm from './partials/UnlockTokenForm';
import UpgradeColonyForm from './partials/UpgradeColonyForm';
import { useActionFormContext } from './partials/ActionForm/ActionFormContext';
import CreateDecisionForm from './partials/CreateDecision';
import EditTeamForm from './partials/EditTeamForm';
import EnterRecoveryModeForm from './partials/EnterRecoveryModeForm';
import {
  canAdminister,
  canArchitect,
  canEnterRecoveryMode,
  canFund,
  hasRoot,
  userHasRole,
} from '~utils/checks';
import ManageTokensForm from './partials/ManageTokensForm';

export const useActionsList = () => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const enabledExtensionData = useEnabledExtensions();
  const { isVotingReputationEnabled, isOneTxPaymentEnabled } =
    enabledExtensionData;

  const userHasAccountRegistered = useUserAccountRegistered();

  const allUserRoles = getAllUserRoles(colony, wallet?.address || '');

  const hasRootPermission = userHasAccountRegistered && hasRoot(allUserRoles);

  const canEnterRecovery =
    userHasAccountRegistered && canEnterRecoveryMode(allUserRoles);
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
    ? colony?.status?.nativeToken?.mintable
    : hasRoot(allUserRoles) && colony?.status?.nativeToken?.mintable;
  const canUserUnlockNativeToken = isVotingReputationEnabled
    ? colony?.status?.nativeToken?.unlockable
    : hasRoot(allUserRoles) && colony?.status?.nativeToken?.unlockable;
  const canManageTokens = hasRoot(allUserRoles);
  const canSmiteReputation =
    userHasAccountRegistered &&
    (userHasRole(allUserRoles, ColonyRole.Arbitration) ||
      isVotingReputationEnabled);
  const canAwardReputation =
    userHasAccountRegistered &&
    (userHasRole(allUserRoles, ColonyRole.Root) || isVotingReputationEnabled);

  return useMemo(
    (): SearchSelectOptionProps[] => [
      {
        key: '1',
        title: { id: 'actions.payments' },
        isAccordion: true,
        options: [
          {
            label: { id: 'actions.simplePayment' },
            value: Actions.SIMPLE_PAYMENT,
            missingPermissions:
              !canCreatePayment || !isOneTxPaymentEnabled
                ? 'actionSidebar.missingPermissions.payment'
                : undefined,
          },
          {
            label: { id: 'actions.advancedPayment' },
            value: Actions.ADVANCED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.batchPayment' },
            value: Actions.BATCH_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.splitPayment' },
            value: Actions.SPLIT_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.stagedPayment' },
            value: Actions.STAGED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.streamingPayment' },
            value: Actions.STREAMING_PAYMENT,
            isDisabled: true,
          },
        ],
      },
      {
        key: '2',
        isAccordion: true,
        title: { id: 'actions.decisions' },
        options: [
          {
            label: { id: 'actions.createDecision' },
            value: Actions.CREATE_DECISION,
            isDisabled: true,
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
            value: Actions.TRANSFER_FUNDS,
            missingPermissions:
              !userHasAccountRegistered ||
              !(canMoveFunds || isVotingReputationEnabled)
                ? 'actionSidebar.missingPermissions.funds'
                : undefined,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: Actions.MINT_TOKENS,
            missingPermissions:
              !userHasAccountRegistered || !canUserMintNativeToken
                ? 'actionSidebar.missingPermissions.root'
                : undefined,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: Actions.UNLOCK_TOKEN,
            missingPermissions:
              !userHasAccountRegistered || !canUserUnlockNativeToken
                ? 'actionSidebar.missingPermissions.root'
                : undefined,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: Actions.MANAGE_TOKENS,
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
            value: Actions.CREATE_NEW_TEAM,
            missingPermissions: !(
              canCreateEditDomain || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.teams'
              : undefined,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: Actions.EDIT_EXISTING_TEAM,
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
          {
            label: { id: 'actions.awardReputation' },
            value: Actions.AWARD_REPUTATION,
            missingPermissions: !canAwardReputation
              ? 'actionSidebar.missingPermissions.awardReputation'
              : undefined,
          },
          {
            label: { id: 'actions.removeReputation' },
            value: Actions.REMOVE_REPUTATION,
            missingPermissions: !canSmiteReputation
              ? 'actionSidebar.missingPermissions.smiteReputation'
              : undefined,
          },
          {
            label: { id: 'actions.managePermissions' },
            value: Actions.MANAGE_PERMISSIONS,
            missingPermissions: !(
              canEnterPermissionManagement || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.permissions'
              : undefined,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: Actions.EDIT_COLONY_DETAILS,
            missingPermissions: !(
              hasRootPermission || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.root'
              : undefined,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: Actions.UPGRADE_COLONY_VERSION,
            missingPermissions: !(
              hasRootPermission || isVotingReputationEnabled
            )
              ? 'actionSidebar.missingPermissions.root'
              : undefined,
          },
          {
            label: { id: 'actions.enterRecoveryMode' },
            value: Actions.ENTER_RECOVERY_MODE,
            missingPermissions: !canEnterRecovery
              ? 'actionSidebar.missingPermissions.recovery'
              : undefined,
          },
          {
            label: { id: 'actions.createNewIntegration' },
            value: Actions.CREATE_NEW_INTEGRATION,
            isDisabled: true,
          },
          {
            label: { id: 'actions.manageColonyObjective' },
            value: Actions.MANAGE_COLONY_OBJECTIVES,
            isDisabled: true,
          },
        ],
      },
    ],
    [],
  );
};

export const useUserPermissionsErrors = (): boolean => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const hasReputation = useColonyHasReputation(colony?.colonyAddress as string);

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const [hasRoles] = useDialogActionPermissions(
    colony as Colony,
    isVotingReputationEnabled,
    requiredRoles,
    allUserRoles,
    hasReputation,
  );

  const showPermissionErrors = !hasRoles && !isVotingReputationEnabled;

  return showPermissionErrors;
};

export const useActionSidebar = (selectedAction) => {
  const { formErrors } = useActionFormContext();

  const isFieldError = !!Object.keys?.(formErrors || {}).length;

  const prepareNofiticationTitle = () => {
    let errorMessage;

    if (selectedAction === Actions.UNLOCK_TOKEN) {
      errorMessage = 'actionSidebar.unlock.token.error';
    } else if (selectedAction === Actions.ENTER_RECOVERY_MODE) {
      errorMessage = 'actionSidebar.enterRecoveryMode.error';
    } else if (isFieldError) {
      errorMessage = 'actionSidebar.fields.error';
    } else {
      errorMessage = 'actionSidebar.mint.token.permission.error';
    }
    return errorMessage;
  };

  const formComponentsByAction = {
    [Actions.SIMPLE_PAYMENT]: SinglePaymentForm,
    [Actions.MINT_TOKENS]: MintTokenForm,
    [Actions.TRANSFER_FUNDS]: TransferFundsForm,
    [Actions.CREATE_NEW_TEAM]: CreateNewTeamForm,
    [Actions.UNLOCK_TOKEN]: UnlockTokenForm,
    [Actions.UPGRADE_COLONY_VERSION]: UpgradeColonyForm,
    [Actions.CREATE_DECISION]: CreateDecisionForm,
    [Actions.EDIT_EXISTING_TEAM]: EditTeamForm,
    [Actions.ENTER_RECOVERY_MODE]: EnterRecoveryModeForm,
    [Actions.MANAGE_TOKENS]: ManageTokensForm,
  };

  return {
    prepareNofiticationTitle,
    formComponentsByAction,
    isFieldError,
  };
};
