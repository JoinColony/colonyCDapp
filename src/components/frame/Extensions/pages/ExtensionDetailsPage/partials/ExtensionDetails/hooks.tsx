import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppContext, useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import { ActionTypes } from '~redux';
import { isInstalledExtensionData } from '~utils/extensions';
import Toast from '~shared/Extensions/Toast';

export const useExtensionDetails = (extensionData: AnyExtensionData) => {
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
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const uninstallAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_UNINSTALL,
    error: ActionTypes.EXTENSION_UNINSTALL_ERROR,
    success: ActionTypes.EXTENSION_UNINSTALL_SUCCESS,
  });

  const reEnableAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const handleDeprecate = useCallback(async () => {
    try {
      await deprecateAsyncFunction(deprecateExtensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionDeprecate.toast.title.success' }}
            description={{ id: 'extensionDeprecate.toast.description.success' }}
          />,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, [deprecateAsyncFunction, deprecateExtensionValues]);

  const handleUninstall = useCallback(async () => {
    try {
      await uninstallAsyncFunction(uninstallExtensionValues);
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionDetailsPage.uninstallSuccessTitle' }}
          description={{
            id: 'extensionDetailsPage.uninstallSuccessDescription',
          }}
        />,
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
            title={{ id: 'extensionReEnable.toast.title.success' }}
            description={{ id: 'extensionReEnable.toast.description.success' }}
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

  return {
    handleDeprecate,
    handleUninstall,
    handleReEnable,
    canExtensionBeUninstalled,
    canExtensionBeDeprecated,
  };
};
