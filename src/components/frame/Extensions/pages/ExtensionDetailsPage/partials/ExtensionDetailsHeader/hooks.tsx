import { type Extension } from '@colony/colony-js';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import { type ExtensionEnableError } from '~redux/sagas/extensions/extensionEnable.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

import { handleWaitingForDbAfterFormCompletion } from '../ExtensionSettings/utils.tsx';

export const useReenable = ({ extensionId }: { extensionId: Extension }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionId);
  const { setIsPendingManagement } = useExtensionDetailsPageContext();

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
      setIsPendingManagement(true);
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
      setIsPendingManagement(false);
      setIsLoading(false);
    }
  };

  return { handleReenable, isLoading };
};

export const useInstall = (extensionData: AnyExtensionData) => {
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const { setActiveTab, setIsPendingManagement, setIsSavingChanges } =
    useExtensionDetailsPageContext();
  const { reset } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);

  const handleInstallSuccess = async () => {
    setIsPendingManagement(true);
    setIsLoading(true);
    await handleWaitingForDbAfterFormCompletion({
      setIsSavingChanges,
      extensionData,
      refetchExtensionData,
      setActiveTab,
      reset,
      method: ExtensionMethods.INSTALL,
    });
    setIsPendingManagement(false);
    setIsLoading(false);
  };

  const handleInstallError = async (error: ExtensionEnableError) => {
    const { initialiseTransactionFailed, setUserRolesTransactionFailed } =
      error;

    if (!initialiseTransactionFailed && !setUserRolesTransactionFailed) {
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionInstall.toast.title.error' }}
          description={{ id: 'extensionInstall.toast.description.error' }}
        />,
      );
      return;
    }

    setIsPendingManagement(true);
    setIsLoading(true);
    await handleWaitingForDbAfterFormCompletion({
      setIsSavingChanges,
      extensionData,
      refetchExtensionData,
      setActiveTab,
      reset,
      method: ExtensionMethods.INSTALL,
      initialiseTransactionFailed,
      setUserRolesTransactionFailed,
    });
    setIsPendingManagement(false);
    setIsLoading(false);
  };

  return {
    handleInstallSuccess,
    handleInstallError,
    isLoading,
  };
};
