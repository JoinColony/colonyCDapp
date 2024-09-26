import { Extension } from '@colony/colony-js';
import React from 'react';
import { type FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { type RefetchColonyFn } from '~context/ColonyContext/ColonyContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import {
  waitForExtensionPermissions,
  waitForDbAfterExtensionAction,
} from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import Toast from '~shared/Extensions/Toast/index.ts';
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

export const getFormSuccessFn =
  <T extends FieldValues>({
    setWaitingForActionConfirmation,
    extensionData,
    refetchColony,
    refetchExtensionData,
    setActiveTab,
  }: {
    setWaitingForActionConfirmation: SetStateFn;
    setActiveTab: (tabId: ExtensionDetailsPageTabId) => void;
    extensionData: AnyExtensionData;
    refetchColony: RefetchColonyFn;
    refetchExtensionData: RefetchExtensionDataFn;
  }): OnSuccess<T> =>
  async (fieldValues, { reset }) => {
    setWaitingForActionConfirmation(true);
    const isSaveChanges =
      extensionData &&
      isInstalledExtensionData(extensionData) &&
      (extensionData.isInitialized || extensionData.configurable);

    try {
      /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
      await waitForExtensionPermissions({ extensionData, refetchColony });
      // @TODO: Decide if needed
      // if (isSaveChanges) {
      //   await waitForDbAfterExtensionAction({
      //     method: ExtensionMethods.SAVE_CHANGES,
      //     refetchExtensionData,
      //     params: fieldValues.params,
      //   });
      // } else {
      if (!isSaveChanges) {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        reset();

        setActiveTab(ExtensionDetailsPageTabId.Overview);
      }

      // }

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
    } catch (error) {
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
    } finally {
      setWaitingForActionConfirmation(false);
    }
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
