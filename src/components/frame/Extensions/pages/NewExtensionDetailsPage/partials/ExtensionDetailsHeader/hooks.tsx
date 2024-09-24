import { type Extension } from '@colony/colony-js';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
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
  const { setActiveTab } = useExtensionDetailsPageContext();
  const {
    colony: {
      colonyAddress,
      nativeToken: { decimals },
    },
  } = useColonyContext();

  const [isLoading, setIsLoading] = useState(false);

  const enableExtension = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
  });

  const handleAutoEnable = useCallback(async () => {
    // Use refetched extension data to ensure it has uodated following the installation
    const updatedExtensionData = await refetchExtensionData();

    try {
      await enableExtension({
        colonyAddress,
        extensionData: updatedExtensionData,
        stakeFraction: getDefaultStakeFraction(decimals),
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
  }, [colonyAddress, decimals, enableExtension, refetchExtensionData]);

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

      if (extensionData.autoEnableAfterInstall) {
        await handleAutoEnable();
      }

      setIsLoading(false);

      // @TODO: Make it work with multi sig
      if (extensionData.initializationParams) {
        setActiveTab(ExtensionDetailsPageTabId.Settings);
      }
    } catch {
      setIsLoading(false);
      showErrorToast();
    }
  }, [
    extensionData,
    handleAutoEnable,
    refetchExtensionData,
    setActiveTab,
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
