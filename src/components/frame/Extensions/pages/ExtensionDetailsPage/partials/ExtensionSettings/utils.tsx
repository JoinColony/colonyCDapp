import { Extension } from '@colony/colony-js';
import React from 'react';
import { type UseFormReset, type FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import { type ExtensionEnableError } from '~redux/sagas/extensions/extensionEnable.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type CustomSubmitErrorHandler } from '~shared/Fields/Form/Form.tsx';
import { type OnSuccess } from '~shared/Fields/index.ts';
import { type SetStateFn } from '~types';
import {
  type ExtensionInitParam,
  type AnyExtensionData,
} from '~types/extensions.ts';
import {
  convertFractionToEth,
  isInstalledExtensionData,
} from '~utils/extensions.ts';

import {
  type MultiSigSettingsFormValues,
  MultiSigThresholdType,
} from './MultiSigSettings/types.ts';
import {
  getDomainThresholds,
  getGlobalThresholdType,
} from './MultiSigSettings/utils.ts';

const getIsSaveChanges = (extensionData: AnyExtensionData) => {
  return (
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    (extensionData.isInitialized || extensionData.configurable)
  );
};

const showEnableErrorToast = (isSaveChanges?: boolean) => {
  toast.error(
    <Toast
      type="error"
      title={{
        id: isSaveChanges
          ? 'extensionSaveChanges.toast.title.error'
          : 'extensionEnable.toast.title.error',
      }}
      description={{
        id: isSaveChanges
          ? 'extensionSaveChanges.toast.description.error'
          : 'extensionEnable.toast.description.error',
      }}
    />,
  );
};

const handleWaitingForDbAfterFormCompletion = async ({
  setWaitingForActionConfirmation,
  extensionData,
  refetchExtensionData,
  setActiveTab,
  initialiseTransactionFailed,
  setUserRolesTransactionFailed,
  reset,
}: {
  setWaitingForActionConfirmation: SetStateFn;
  setActiveTab: (tabId: ExtensionDetailsPageTabId) => void;
  extensionData: AnyExtensionData;
  refetchExtensionData: RefetchExtensionDataFn;
  initialiseTransactionFailed?: boolean;
  setUserRolesTransactionFailed?: boolean;
  reset: UseFormReset<object>;
}) => {
  setWaitingForActionConfirmation(true);
  const isSaveChanges = getIsSaveChanges(extensionData);

  try {
    if (!isSaveChanges) {
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.ENABLE,
        refetchExtensionData,
        initialiseTransactionFailed,
        setUserRolesTransactionFailed,
      });

      if (initialiseTransactionFailed) {
        toast.error(
          <Toast
            type="error"
            title={{ id: 'extensionEnable.toast.title.error' }}
            description={{ id: 'extensionEnable.toast.description.error' }}
          />,
        );
        return;
      }

      reset();

      if (setUserRolesTransactionFailed) {
        toast.error(
          <Toast
            type="error"
            title={{ id: 'extensionSetUserRoles.toast.title.error' }}
            description={{
              id: 'extensionSetUserRoles.toast.description.error',
            }}
          />,
        );
        return;
      }

      setActiveTab(ExtensionDetailsPageTabId.Overview);
    }

    toast.success(
      <Toast
        type="success"
        title={{
          id: isSaveChanges
            ? 'extensionSaveChanges.toast.title.success'
            : 'extensionEnable.toast.title.success',
        }}
        description={{
          id: isSaveChanges
            ? 'extensionSaveChanges.toast.description.success'
            : 'extensionEnable.toast.description.success',
        }}
      />,
    );
  } catch {
    showEnableErrorToast(isSaveChanges);
  } finally {
    setWaitingForActionConfirmation(false);
  }
};

export const getFormSuccessFn =
  <T extends FieldValues>({
    setWaitingForActionConfirmation,
    extensionData,
    refetchExtensionData,
    setActiveTab,
  }: {
    setWaitingForActionConfirmation: SetStateFn;
    setActiveTab: (tabId: ExtensionDetailsPageTabId) => void;
    extensionData: AnyExtensionData;
    refetchExtensionData: RefetchExtensionDataFn;
  }): OnSuccess<T> =>
  async (_, { reset }) => {
    await handleWaitingForDbAfterFormCompletion({
      setWaitingForActionConfirmation,
      extensionData,
      refetchExtensionData,
      setActiveTab,
      reset,
    });
  };

export const getFormErrorFn =
  <T extends FieldValues>({
    setWaitingForActionConfirmation,
    extensionData,
    refetchExtensionData,
    setActiveTab,
  }: {
    setWaitingForActionConfirmation: SetStateFn;
    setActiveTab: (tabId: ExtensionDetailsPageTabId) => void;
    extensionData: AnyExtensionData;
    refetchExtensionData: RefetchExtensionDataFn;
  }): CustomSubmitErrorHandler<T> =>
  async (error, { reset }) => {
    const { initialiseTransactionFailed, setUserRolesTransactionFailed } =
      error as ExtensionEnableError;

    if (initialiseTransactionFailed || setUserRolesTransactionFailed) {
      await handleWaitingForDbAfterFormCompletion({
        setWaitingForActionConfirmation,
        extensionData,
        refetchExtensionData,
        setActiveTab,
        reset,
        initialiseTransactionFailed,
        setUserRolesTransactionFailed,
      });
      return;
    }

    const isSaveChanges = getIsSaveChanges(extensionData);
    showEnableErrorToast(isSaveChanges);
  };

export const getExtensionSettingsActionType = (
  extensionData: AnyExtensionData,
) => {
  const isExtensionInstalled = isInstalledExtensionData(extensionData);

  switch (extensionData.extensionId) {
    case Extension.MultisigPermissions: {
      return ActionTypes.MULTISIG_SET_THRESHOLDS;
    }
    case Extension.StakedExpenditure: {
      if (
        isExtensionInstalled &&
        (extensionData.isEnabled || extensionData.isDeprecated)
      ) {
        return ActionTypes.SET_STAKE_FRACTION;
      }

      return ActionTypes.EXTENSION_ENABLE;
    }
    default: {
      return ActionTypes.EXTENSION_ENABLE;
    }
  }
};

export const mapExtensionActionPayload = (
  extensionData: AnyExtensionData,
  formValues: Record<string, any>,
  initializationParams?: ExtensionInitParam[],
) => {
  if (extensionData.extensionId === Extension.MultisigPermissions) {
    const { thresholdType } = formValues;
    return {
      globalThreshold:
        thresholdType === MultiSigThresholdType.MAJORITY_APPROVAL
          ? 0
          : formValues.globalThreshold,
      domainThresholds: getDomainThresholds(
        formValues as MultiSigSettingsFormValues,
      ),
      thresholdType,
    };
  }

  return initializationParams?.reduce(
    (formattedPayload, { paramName, transformValue }) => {
      const paramValue = transformValue
        ? transformValue(formValues[paramName])
        : formValues[paramName];
      return {
        ...formattedPayload,
        [paramName]: paramValue,
      };
    },
    {},
  );
};

const getInitializationDefaultValues = (
  initializationParams: ExtensionInitParam[],
) => {
  return initializationParams.reduce<
    Record<string, string | number | undefined>
  >((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const getExtensionSettingsDefaultValues = (
  extensionData: AnyExtensionData,
): object => {
  const { initializationParams = [] } = extensionData;
  const defaultValues = getInitializationDefaultValues(initializationParams);

  if (!isInstalledExtensionData(extensionData)) {
    return defaultValues;
  }

  switch (extensionData.extensionId) {
    case Extension.StakedExpenditure: {
      return {
        stakeFraction: extensionData?.params?.stakedExpenditure?.stakeFraction
          ? convertFractionToEth(
              extensionData.params.stakedExpenditure.stakeFraction,
            )
          : String(defaultValues.stakeFraction),
      };
    }
    case Extension.MultisigPermissions: {
      const { colonyThreshold: globalThreshold } =
        extensionData.params?.multiSig ?? {};

      return {
        thresholdType:
          globalThreshold !== undefined
            ? getGlobalThresholdType(globalThreshold)
            : MultiSigThresholdType.MAJORITY_APPROVAL,
        globalThreshold: globalThreshold ?? 0,
        domainThresholds: [],
      } satisfies MultiSigSettingsFormValues;
    }
    default: {
      return defaultValues;
    }
  }
};
