import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useAppContext, useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import { ActionTypes } from '~redux';
import { isInstalledExtensionData } from '~utils/extensions';
import Toast from '~shared/Extensions/Toast';

export const useExtensionDetails = (extensionData: AnyExtensionData) => {
  const deprecateSubmit = ActionTypes.EXTENSION_DEPRECATE;
  const deprecateError = ActionTypes.EXTENSION_DEPRECATE_ERROR;
  const deprecateSuccess = ActionTypes.EXTENSION_DEPRECATE_SUCCESS;
  const uninstallSubmit = ActionTypes.EXTENSION_UNINSTALL;
  const uninstallError = ActionTypes.EXTENSION_UNINSTALL_ERROR;
  const uninstallSuccess = ActionTypes.EXTENSION_UNINSTALL_SUCCESS;
  const reEnableSubmit = ActionTypes.EXTENSION_DEPRECATE;
  const reEnableError = ActionTypes.EXTENSION_DEPRECATE_ERROR;
  const reEnableSuccess = ActionTypes.EXTENSION_DEPRECATE_SUCCESS;

  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionId } = extensionData;

  const deprecateExtensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
      isToDeprecate: true,
    };
  }, [colony?.colonyAddress, extensionId]);

  const uninstallExtensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
    };
  }, [colony?.colonyAddress, extensionId]);

  const reEnableExtensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
      isToDeprecate: false,
    };
  }, [colony?.colonyAddress, extensionId]);

  const deprecateAsyncFunction = useAsyncFunction({
    submit: deprecateSubmit,
    error: deprecateError,
    success: deprecateSuccess,
  });

  const uninstallAsyncFunction = useAsyncFunction({
    submit: uninstallSubmit,
    error: uninstallError,
    success: uninstallSuccess,
  });

  const reEnableAsyncFunction = useAsyncFunction({
    submit: reEnableSubmit,
    error: reEnableError,
    success: reEnableSuccess,
  });

  const handleDeprecate = useCallback(async () => {
    try {
      await deprecateAsyncFunction(deprecateExtensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionDetailsPage.deprecateSuccessTitle' }}
            description={{ id: 'extensionDetailsPage.deprecateSuccessDescription' }}
          />,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, [deprecateAsyncFunction, deprecateExtensionValues]);

  const handleUninstall = useCallback(async () => {
    try {
      await uninstallAsyncFunction(uninstallExtensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionDetailsPage.uninstallSuccessTitle' }}
            description={{ id: 'extensionDetailsPage.uninstallSuccessDescription' }}
          />,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, [uninstallAsyncFunction, uninstallExtensionValues]);

  const handleReEnable = useCallback(async () => {
    try {
      await reEnableAsyncFunction(reEnableExtensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionDetailsPage.reEnableSuccessTitle' }}
            description={{ id: 'extensionDetailsPage.reEnableSuccessDescription' }}
          />,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, [reEnableAsyncFunction, reEnableExtensionValues]);

  const hasRegisteredProfile = !!user;
  const canExtensionBeUninstalled = !!(
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );

  const canExtensionBeDeprecated =
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  return { handleDeprecate, handleUninstall, handleReEnable, canExtensionBeUninstalled, canExtensionBeDeprecated };
};
