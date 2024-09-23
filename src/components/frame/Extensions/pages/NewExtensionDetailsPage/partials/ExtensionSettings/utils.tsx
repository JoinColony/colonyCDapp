import { Extension } from '@colony/colony-js';
import React from 'react';
import { type FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

import { type RefetchColonyFn } from '~context/ColonyContext/ColonyContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import {
  waitForExtensionPermissions,
  waitForDbAfterExtensionAction,
} from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type OnSuccess } from '~shared/Fields/index.ts';
import { type SetStateFn } from '~types';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

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
      extensionData.enabledAutomaticallyAfterInstall &&
      (extensionData.isEnabled || extensionData.isDeprecated);

    try {
      /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
      await waitForExtensionPermissions({ extensionData, refetchColony });
      if (isSaveChanges) {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.SAVE_CHANGES,
          refetchExtensionData,
          params: fieldValues.params,
        });
      } else {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        reset();

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
