import { type Extension } from '@colony/colony-js';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import {
  waitForDbAfterExtensionAction,
  waitForExtensionPermissions,
} from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { getDefaultStakeFraction } from '~utils/extensions.ts';

export const useReenable = ({ extensionId }: { extensionId: Extension }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionId);

  const enableExtensionValues = {
    colonyAddress,
    extensionId,
    isToDeprecate: false,
  };

  const enableAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const handleReenable = async () => {
    try {
      setIsLoading(true);
      await enableAsyncFunction(enableExtensionValues);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.REENABLE,
        refetchExtensionData,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionReEnable.toast.title.success' }}
          description={{ id: 'extensionReEnable.toast.description.success' }}
        />,
      );
    } catch (err) {
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionReEnable.toast.title.error' }}
          description={{
            id: 'extensionReEnable.toast.description.error',
          }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleReenable, isLoading };
};

export const useInstall = (extensionData: AnyExtensionData) => {
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const { setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();
  const {
    colony: {
      colonyAddress,
      nativeToken: { decimals },
    },
    refetchColony,
  } = useColonyContext();
  const { reset } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);

  const enableExtension = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
  });

  const handleAutoEnable = useCallback(async () => {
    // Use refetched extension data to ensure it has uodated following the installation
    const updatedExtensionData = await refetchExtensionData();

    if (!updatedExtensionData) {
      return;
    }

    try {
      await enableExtension({
        colonyAddress,
        extensionData: updatedExtensionData,
        stakeFraction: getDefaultStakeFraction(decimals),
      });

      /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
      await waitForExtensionPermissions({
        extensionData: updatedExtensionData,
        refetchColony,
      });

      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.ENABLE,
        refetchExtensionData,
      });

      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionEnable.toast.title.success' }}
          description={{
            id: 'extensionEnable.toast.description.success',
          }}
        />,
      );
    } catch {
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionEnable.toast.title.error' }}
          description={{
            id: 'extensionEnable.toast.description.error',
          }}
        />,
      );
    }
  }, [
    colonyAddress,
    decimals,
    enableExtension,
    refetchColony,
    refetchExtensionData,
  ]);

  const showErrorToast = useCallback(() => {
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionInstall.toast.title.error' }}
        description={{ id: 'extensionInstall.toast.description.error' }}
      />,
    );
  }, []);

  const handleInstallSuccess = useCallback(async () => {
    setIsLoading(true);
    setWaitingForActionConfirmation(true);

    try {
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.INSTALL,
        refetchExtensionData,
      });

      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionInstall.toast.title.success' }}
          description={{
            id: 'extensionInstall.toast.description.success',
          }}
        />,
      );

      if (extensionData.initializationParams || extensionData.configurable) {
        reset();
        setActiveTab(ExtensionDetailsPageTabId.Settings);
      }

      if (extensionData.autoEnableAfterInstall) {
        await handleAutoEnable();
      }
    } catch {
      showErrorToast();
    } finally {
      setIsLoading(false);
      setWaitingForActionConfirmation(false);
    }
  }, [
    extensionData.autoEnableAfterInstall,
    extensionData.configurable,
    extensionData.initializationParams,
    handleAutoEnable,
    refetchExtensionData,
    reset,
    setActiveTab,
    setWaitingForActionConfirmation,
    showErrorToast,
  ]);

  const handleInstallError = useCallback(() => {
    showErrorToast();
  }, [showErrorToast]);

  return {
    handleInstallSuccess,
    handleInstallError,
    isLoading,
  };
};
