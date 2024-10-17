import { type Extension } from '@colony/colony-js';
import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import { ExtensionInstallAndEnableErrorStep } from '~redux/sagas/extensions/extensionInstallAndEnable.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

import { getExtensionSettingsDefaultValues } from '../ExtensionSettings/utils.tsx';

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
  const { reset } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);

  const showInstallErrorToast = useCallback(() => {
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionInstall.toast.title.error' }}
        description={{ id: 'extensionInstall.toast.description.error' }}
      />,
    );
  }, []);

  const showInitialiseErrorToast = useCallback(() => {
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionEnable.toast.title.error' }}
        description={{ id: 'extensionEnable.toast.description.error' }}
      />,
    );
  }, []);

  const showSetUserRolesErrorToast = useCallback(() => {
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionSetUserRoles.toast.title.error' }}
        description={{ id: 'extensionSetUserRoles.toast.description.error' }}
      />,
    );
  }, []);

  const handleInstallSuccess = useCallback(
    async ({
      initialiseTransactionFailed,
      setUserRolesTransactionFailed,
    }: {
      initialiseTransactionFailed?: boolean;
      setUserRolesTransactionFailed?: boolean;
    }) => {
      setIsLoading(true);
      setWaitingForActionConfirmation(true);

      try {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.INSTALL,
          refetchExtensionData,
          initialiseTransactionFailed,
          setUserRolesTransactionFailed,
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

        if (initialiseTransactionFailed) {
          showInitialiseErrorToast();
        }

        if (setUserRolesTransactionFailed) {
          showSetUserRolesErrorToast();
        }

        if (extensionData.initializationParams || extensionData.configurable) {
          // Reset the form to the default values using most recent extension data
          const updatedExtensionData = await refetchExtensionData();
          if (updatedExtensionData) {
            reset(getExtensionSettingsDefaultValues(updatedExtensionData));
            setActiveTab(ExtensionDetailsPageTabId.Settings);
          }
        }
      } catch {
        showInstallErrorToast();
      } finally {
        setIsLoading(false);
        setWaitingForActionConfirmation(false);
      }
    },
    [
      extensionData.configurable,
      extensionData.initializationParams,
      refetchExtensionData,
      reset,
      setActiveTab,
      setWaitingForActionConfirmation,
      showInstallErrorToast,
      showInitialiseErrorToast,
      showSetUserRolesErrorToast,
    ],
  );

  const handleInstallError = useCallback(
    (error: any) => {
      const { step } = error;

      if (step === ExtensionInstallAndEnableErrorStep.Initialise) {
        handleInstallSuccess({ initialiseTransactionFailed: true });
        return;
      }

      if (step === ExtensionInstallAndEnableErrorStep.SetUserRoles) {
        handleInstallSuccess({ setUserRolesTransactionFailed: true });
        return;
      }

      showInstallErrorToast();
    },
    [showInstallErrorToast, handleInstallSuccess],
  );

  return {
    handleInstallSuccess,
    handleInstallError,
    isLoading,
  };
};
