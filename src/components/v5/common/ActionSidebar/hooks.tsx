import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useUnmountEffect } from 'framer-motion';
import { ACTION, Action } from '~constants/actions';
import {
  useAppContext,
  useColonyContext,
  useColonyHasReputation,
  useDialogActionPermissions,
  useEnabledExtensions,
  useGlobalEventHandler,
  useTransformer,
  useUserAccountRegistered,
} from '~hooks';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import { Colony } from '~types';
import { getAllUserRoles } from '~transformers';
import SinglePaymentForm from './partials/forms/SimplePaymentForm';
import MintTokenForm from './partials/forms/MintTokenForm';
import TransferFundsForm from './partials/forms/TransferFundsForm';
import CreateNewTeamForm from './partials/forms/CreateNewTeamForm';
import UnlockTokenForm from './partials/forms/UnlockTokenForm';
import UpgradeColonyForm from './partials/forms/UpgradeColonyForm';
import CreateDecisionForm from './partials/forms/CreateDecisionForm';
import EditTeamForm from './partials/forms/EditTeamForm';
import EnterRecoveryModeForm from './partials/forms/EnterRecoveryModeForm';
import EditColonyDetailsForm from './partials/forms/EditColonyDetailsForm';
import {
  canAdminister,
  canArchitect,
  canEnterRecoveryMode,
  canFund,
  hasRoot,
  userHasRole,
} from '~utils/checks';
import { ACTION_TYPE_FIELD_NAME, ACTION_TYPE_NOTIFICATION } from './consts';
import { NotificationBannerProps } from '~common/Extensions/NotificationBanner/types';
import { ActionFormBaseProps, UseActionFormBaseHook } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';
import { SetActionTypeCutomEventDetail } from '~utils/browser/dispatchGlobalEvent/types';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { ActionTypes } from '~redux';

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
            value: ACTION.SIMPLE_PAYMENT,
            missingPermissions:
              !canCreatePayment || !isOneTxPaymentEnabled
                ? 'actionSidebar.missingPermissions.payment'
                : undefined,
          },
          {
            label: { id: 'actions.advancedPayment' },
            value: ACTION.ADVANCED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.batchPayment' },
            value: ACTION.BATCH_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.splitPayment' },
            value: ACTION.SPLIT_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.stagedPayment' },
            value: ACTION.STAGED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.streamingPayment' },
            value: ACTION.STREAMING_PAYMENT,
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
            value: ACTION.CREATE_DECISION,
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
          {
            label: { id: 'actions.awardReputation' },
            value: ACTION.AWARD_REPUTATION,
            missingPermissions: !canAwardReputation
              ? 'actionSidebar.missingPermissions.awardReputation'
              : undefined,
          },
          {
            label: { id: 'actions.removeReputation' },
            value: ACTION.REMOVE_REPUTATION,
            missingPermissions: !canSmiteReputation
              ? 'actionSidebar.missingPermissions.smiteReputation'
              : undefined,
          },
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
          {
            label: { id: 'actions.enterRecoveryMode' },
            value: ACTION.ENTER_RECOVERY_MODE,
            missingPermissions: !canEnterRecovery
              ? 'actionSidebar.missingPermissions.recovery'
              : undefined,
          },
          {
            label: { id: 'actions.createNewIntegration' },
            value: ACTION.CREATE_NEW_INTEGRATION,
            isDisabled: true,
          },
          {
            label: { id: 'actions.manageColonyObjective' },
            value: ACTION.MANAGE_COLONY_OBJECTIVES,
            isDisabled: true,
          },
        ],
      },
    ],
    [
      canAwardReputation,
      canCreateEditDomain,
      canCreatePayment,
      canEnterPermissionManagement,
      canEnterRecovery,
      canManageTokens,
      canMoveFunds,
      canSmiteReputation,
      canUserMintNativeToken,
      canUserUnlockNativeToken,
      hasRootPermission,
      isOneTxPaymentEnabled,
      isVotingReputationEnabled,
      userHasAccountRegistered,
    ],
  );
};

export const useUserHasPermissions = (): boolean => {
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

  return hasRoles || isVotingReputationEnabled;
};

export const useSidebarActionForm = () => {
  const actionFormComponents = useMemo<
    Partial<Record<Action, React.FC<ActionFormBaseProps>>>
  >(
    () => ({
      [ACTION.SIMPLE_PAYMENT]: SinglePaymentForm,
      [ACTION.MINT_TOKENS]: MintTokenForm,
      [ACTION.TRANSFER_FUNDS]: TransferFundsForm,
      [ACTION.CREATE_NEW_TEAM]: CreateNewTeamForm,
      [ACTION.UNLOCK_TOKEN]: UnlockTokenForm,
      [ACTION.UPGRADE_COLONY_VERSION]: UpgradeColonyForm,
      [ACTION.CREATE_DECISION]: CreateDecisionForm,
      [ACTION.EDIT_EXISTING_TEAM]: EditTeamForm,
      [ACTION.ENTER_RECOVERY_MODE]: EnterRecoveryModeForm,
      [ACTION.EDIT_COLONY_DETAILS]: EditColonyDetailsForm,
    }),
    [],
  );

  const form = useFormContext();
  const selectedAction: Action | undefined = form.watch(ACTION_TYPE_FIELD_NAME);
  const hasErrors = !form.formState.isValid && form.formState.isSubmitted;
  const formComponent = selectedAction
    ? actionFormComponents[selectedAction]
    : undefined;

  useGlobalEventHandler<SetActionTypeCutomEventDetail>(
    GLOBAL_EVENTS.SET_ACTION_TYPE,
    (event) => {
      form.setValue(ACTION_TYPE_FIELD_NAME, event.detail.actionType, {
        shouldDirty: true,
      });
    },
  );

  return {
    selectedAction,
    hasErrors,
    formComponent,
  };
};

export const useActionFormProps = () => {
  const [actionFormProps, setActionFormProps] = useState<ActionFormProps<any>>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    children: undefined,
  });
  const getFormOptions = useCallback<ActionFormBaseProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }

      setActionFormProps({ ...formOptions, children: undefined });

      const { defaultValues } = formOptions || {};
      const { title, [ACTION_TYPE_FIELD_NAME]: actionType } = form.getValues();

      form.reset({
        ...(typeof defaultValues === 'function'
          ? await defaultValues()
          : defaultValues || {}),
        title,
      });

      form.setValue(ACTION_TYPE_FIELD_NAME, actionType);
    },
    [],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};

export const useNotificationBanner = (
  hasError: boolean,
  selectedAction: string | undefined,
): NotificationBannerProps | undefined =>
  useMemo(() => {
    const actionTypeNotificationTitle = selectedAction
      ? ACTION_TYPE_NOTIFICATION[selectedAction]
      : undefined;

    if (actionTypeNotificationTitle) {
      return {
        status: 'error',
        title: actionTypeNotificationTitle,
        action: {
          type: 'call-to-action',
          actionText: <FormattedMessage id="learn.more" />,
        },
      };
    }

    if (!hasError) {
      return undefined;
    }

    return {
      status: 'error',
      title: <FormattedMessage id="actionSidebar.fields.error" />,
    };
  }, [hasError, selectedAction]);

export const useActionFormBaseHook: UseActionFormBaseHook = ({
  validationSchema,
  transform,
  defaultValues,
  actionType,
  getFormOptions,
}) => {
  const form = useFormContext();
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
  } = useActionSidebarContext();

  useEffect(() => {
    getFormOptions(
      {
        transform,
        actionType,
        validationSchema,
        defaultValues,
        onSuccess: () => {
          toggleActionSidebarOff();
        },
      },
      form,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, validationSchema, toggleActionSidebarOff]);

  useUnmountEffect(() => {
    getFormOptions(undefined, form);
  });
};

export const useCloseSidebarClick = (dirtyFields: Record<string, any>) => {
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
    cancelModalToggle: [, { toggle: toggleCancelModal }],
  } = useActionSidebarContext();

  return () => {
    if (Object.keys(dirtyFields).length > 0) {
      toggleCancelModal();
    } else {
      toggleActionSidebarOff();
    }
  };
};
