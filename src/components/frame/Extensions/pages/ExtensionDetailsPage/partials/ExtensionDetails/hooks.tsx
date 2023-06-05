import { useCallback, useMemo } from 'react';
import { useAppContext, useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import { ActionTypes } from '~redux';
import { isInstalledExtensionData } from '~utils/extensions';

export const useExtensionDetails = (extensionData: AnyExtensionData) => {
  const submit = ActionTypes.EXTENSION_DEPRECATE;
  const error = ActionTypes.EXTENSION_DEPRECATE_ERROR;
  const success = ActionTypes.EXTENSION_DEPRECATE_SUCCESS;

  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionId } = extensionData;

  const extensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
      isToDeprecate: true,
    };
  }, [colony?.colonyAddress, extensionId]);

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleDeprecate = useCallback(async () => {
    try {
      await asyncFunction(extensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunction, extensionValues]);

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

  return { handleDeprecate, canExtensionBeUninstalled, canExtensionBeDeprecated };
};
