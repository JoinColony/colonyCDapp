import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ColonyRole } from '@colony/colony-js';
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useUnmountEffect } from 'framer-motion';
import { useApolloClient } from '@apollo/client';
import { ACTION, Action } from '~constants/actions';
import {
  useAppContext,
  useColonyContext,
  useColonyHasReputation,
  useDialogActionPermissions,
  useEnabledExtensions,
  useFlatFormErrors,
  useGlobalEventHandler,
  useTransformer,
  useUserAccountRegistered,
} from '~hooks';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import { Colony, ColonyActionType } from '~types';
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
import {
  ActionFormBaseProps,
  DescriptionMetadataGetter,
  UseActionFormBaseHook,
} from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';
import { SetActionTypeCutomEventDetail } from '~utils/browser/dispatchGlobalEvent/types';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { ActionTypes } from '~redux';
import SplitPaymentForm from './partials/forms/SplitPaymentForm';
import ManageTokensForm from './partials/forms/ManageTokensForm';
import AdvancedPaymentForm from './partials/forms/AdvancedPaymentForm';
import BatchPaymentForm from './partials/forms/BatchPaymentForm';
import AsyncText from '~v5/shared/AsyncText';
import { simplePaymentDescriptionMetadataGetter } from './partials/forms/SimplePaymentForm/utils';
import { advancedPaymentDescriptionMetadataGetter } from './partials/forms/AdvancedPaymentForm/utils';
import { splitPaymentDescriptionMetadataGetter } from './partials/forms/SplitPaymentForm/utils';
import { trasferFundsDescriptionMetadataGetter } from './partials/forms/TransferFundsForm/utils';
import { mintTokenDescriptionMetadataGetter } from './partials/forms/MintTokenForm/utils';
import { unlockTokenDescriptionMetadataGetter } from './partials/forms/UnlockTokenForm/utils';
import { manageTokensDescriptionMetadataGetter } from './partials/forms/ManageTokensForm/utils';
import { editColonyDetailsDescriptionMetadataGetter } from './partials/forms/EditColonyDetailsForm/utils';
import { createNewTeamDescriptionMetadataGetter } from './partials/forms/CreateNewTeamForm/utils';
import { editTeamDescriptionMetadataGetter } from './partials/forms/EditTeamForm/utils';
import { upgradeColonyDescriptionMetadataGetter } from './partials/forms/UpgradeColonyForm/utils';
import { enterRecoveryModeDescriptionMetadataGetter } from './partials/forms/EnterRecoveryModeForm/utils';
import { createDecisionDescriptionMetadataGetter } from './partials/forms/CreateDecisionForm/utils';
import { useGetColonyAction } from '~common/ColonyActions';

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
          },
          {
            label: { id: 'actions.batchPayment' },
            value: ACTION.BATCH_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.splitPayment' },
            value: ACTION.SPLIT_PAYMENT,
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
      [ACTION.SPLIT_PAYMENT]: SplitPaymentForm,
      [ACTION.MANAGE_TOKENS]: ManageTokensForm,
      [ACTION.ADVANCED_PAYMENT]: AdvancedPaymentForm,
      [ACTION.BATCH_PAYMENT]: BatchPaymentForm,
    }),
    [],
  );

  const form = useFormContext();
  const selectedAction: Action | undefined = form.watch(ACTION_TYPE_FIELD_NAME);
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
    formComponent,
  };
};

export const useActionFormProps = (
  defaultMotionValues: ActionFormProps<any>['defaultValues'],
  isReadyonly?: boolean,
) => {
  const [actionFormProps, setActionFormProps] = useState<ActionFormProps<any>>({
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    defaultValues: {
      ...defaultMotionValues,
    },
    children: undefined,
  });
  const getFormOptions = useCallback<ActionFormBaseProps['getFormOptions']>(
    async (formOptions, form) => {
      if (!formOptions) {
        return;
      }

      setActionFormProps({
        ...formOptions,
        options: {
          readonly: isReadyonly,
          ...formOptions.options,
        },
        children: undefined,
      });

      const { defaultValues } = formOptions || {};
      const { title, [ACTION_TYPE_FIELD_NAME]: actionType } = form.getValues();

      form.reset({
        ...(typeof defaultValues === 'function'
          ? await defaultValues()
          : defaultValues || {}),
        ...(defaultMotionValues || {}),
        title,
      });

      form.setValue(ACTION_TYPE_FIELD_NAME, actionType);
    },
    [isReadyonly, defaultMotionValues],
  );

  return {
    actionFormProps,
    getFormOptions,
  };
};

export const useNotificationBanner = ():
  | NotificationBannerProps
  | undefined => {
  const { formState } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const flatFormErrors = useFlatFormErrors(formState.errors);

  return useMemo(() => {
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

    if (!hasErrors) {
      return undefined;
    }

    return {
      status: 'error',
      title: <FormattedMessage id="actionSidebar.fields.error" />,
      children: flatFormErrors.length ? (
        <ul className="list-disc list-inside">
          {flatFormErrors.map(({ key, message }) => (
            <li key={key}>{message}</li>
          ))}
        </ul>
      ) : undefined,
    };
  }, [flatFormErrors, hasErrors, selectedAction]);
};

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

export const useCloseSidebarClick = () => {
  const formContext = useFormContext();
  const formRef = useRef<UseFormReturn<object>>(null);
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
    cancelModalToggle: [, { toggle: toggleCancelModal }],
  } = useActionSidebarContext();

  return {
    closeSidebarClick: () => {
      const { dirtyFields } = (formContext || formRef.current)?.formState || {};

      if (Object.keys(dirtyFields).length > 0) {
        toggleCancelModal();
      } else {
        toggleActionSidebarOff();
      }
    },
    formRef,
  };
};

const DESC_METADATA: Partial<Record<Action, DescriptionMetadataGetter>> = {
  [ACTION.SIMPLE_PAYMENT]: simplePaymentDescriptionMetadataGetter,
  [ACTION.ADVANCED_PAYMENT]: advancedPaymentDescriptionMetadataGetter,
  [ACTION.SPLIT_PAYMENT]: splitPaymentDescriptionMetadataGetter,
  [ACTION.TRANSFER_FUNDS]: trasferFundsDescriptionMetadataGetter,
  [ACTION.MINT_TOKENS]: mintTokenDescriptionMetadataGetter,
  [ACTION.UNLOCK_TOKEN]: unlockTokenDescriptionMetadataGetter,
  [ACTION.MANAGE_TOKENS]: manageTokensDescriptionMetadataGetter,
  [ACTION.EDIT_COLONY_DETAILS]: editColonyDetailsDescriptionMetadataGetter,
  [ACTION.CREATE_NEW_TEAM]: createNewTeamDescriptionMetadataGetter,
  [ACTION.EDIT_EXISTING_TEAM]: editTeamDescriptionMetadataGetter,
  [ACTION.UPGRADE_COLONY_VERSION]: upgradeColonyDescriptionMetadataGetter,
  [ACTION.ENTER_RECOVERY_MODE]: enterRecoveryModeDescriptionMetadataGetter,
  [ACTION.CREATE_DECISION]: createDecisionDescriptionMetadataGetter,
};

export const useActionDescriptionMetadata = () => {
  const formValues = useFormContext().getValues();
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const apolloClient = useApolloClient();
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  return useMemo(() => {
    if (!selectedAction) {
      return undefined;
    }

    return (
      <AsyncText
        text={async () =>
          DESC_METADATA[selectedAction]?.(formValues, {
            client: apolloClient,
            currentUser: user,
            colony,
          })
        }
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formValues), selectedAction, apolloClient, colony]);
};

export const useGetActionDefaultValues = (
  transactionId: string | undefined,
) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);

  const defaultValues = useMemo(() => {
    if (!action) {
      return undefined;
    }

    const repeatableFields = {
      createdIn: action.motionData?.motionDomain.nativeId.toString(),
      description: action.annotation?.message,
      // @TODO: handle title and decision if it will be available in api
      // title: action.title,
      // decisionMethod: action.decisionMethod
    };

    switch (action.type) {
      case ColonyActionType.MintTokensMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.MINT_TOKENS,
          amount: {
            amount: action?.amount,
            tokenAddress: action.token?.tokenAddress,
          },
          ...repeatableFields,
        };
      case ColonyActionType.PaymentMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
          amount: {
            amount: action?.amount,
            tokenAddress: action.token?.tokenAddress,
          },
          from: action.fromDomain?.nativeId.toString(),
          recipient: action.recipientAddress,
          ...repeatableFields,
        };
      case ColonyActionType.MultiplePaymentMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
          from: action.fromDomain?.nativeId.toString(),
          amount: {
            amount: action.payments?.[0]?.amount,
            tokenAddress: action.payments?.[0]?.tokenAddress,
          },
          recipient: action.payments?.[0]?.recipientAddress,
          payments: action.payments
            ?.slice(1, action.payments.length)
            .map((payment) => {
              return {
                amount: {
                  amount: payment.amount,
                  tokenAddress: payment.tokenAddress,
                },
                recipient: payment.recipientAddress,
              };
            }),
          ...repeatableFields,
        };
      case ColonyActionType.MoveFundsMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.TRANSFER_FUNDS,
          from: action.fromDomain?.nativeId.toString(),
          to: action.toDomain?.nativeId.toString(),
          amount: {
            amount: action?.amount,
            tokenAddress: action.token?.tokenAddress,
          },
          recipient: action.recipientAddress,
          ...repeatableFields,
        };
      case ColonyActionType.ColonyEditMotion: {
        const modifiedTokens =
          action.pendingColonyMetadata?.modifiedTokenAddresses?.added?.map(
            (token) => ({
              token,
            }),
          );
        const colonyTokens = action.colony.tokens?.items?.map((token) => ({
          token: token?.token?.tokenAddress,
        }));
        const allTokens = [...(colonyTokens || []), ...(modifiedTokens || [])];
        if (modifiedTokens && modifiedTokens?.length > 0) {
          return {
            [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_TOKENS,
            selectedTokenAddresses: allTokens,
            ...repeatableFields,
          };
        }
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_COLONY_DETAILS,
          colonyName: action.pendingColonyMetadata?.displayName,
          colonyAvatar:
            action.pendingColonyMetadata?.avatar ||
            action.pendingColonyMetadata?.thumbnail,
          colonyDescription: action.pendingColonyMetadata?.description,
          externalLinks: action.pendingColonyMetadata?.externalLinks,
          ...repeatableFields,
        };
      }
      case ColonyActionType.CreateDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
          teamName: action.pendingDomainMetadata?.name,
          domainColor: action.pendingDomainMetadata?.color,
          domainPurpose: action.pendingDomainMetadata?.description,
          ...repeatableFields,
        };
      case ColonyActionType.EditDomainMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.EDIT_EXISTING_TEAM,
          team: action.motionData?.motionDomain?.nativeId?.toString(),
          teamName: action.pendingDomainMetadata?.name,
          domainColor: action.pendingDomainMetadata?.color,
          domainPurpose: action.pendingDomainMetadata?.description,
          ...repeatableFields,
        };
      case ColonyActionType.CreateDecisionMotion:
        return {
          [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_DECISION,
          createdIn: action.decisionData?.motionDomainId.toString(),
          title: action.decisionData?.title,
          description: action.decisionData?.description,
        };
      default:
        return undefined;
    }
  }, [action]);

  return {
    defaultValues,
    loadingAction,
  };
};
