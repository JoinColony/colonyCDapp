import { useCallback, useMemo } from 'react';
import { useAsyncFunction, useColonyContext, useExtensionData } from '~hooks';
import { ActionTypes } from '~redux';
import { isInstalledExtensionData } from '~utils/extensions';
import { useExtensionsBadge } from '~hooks/useExtensionsBadgeStatus';

export const useExtensionItem = (extensionId: string) => {
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId);

  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

  const { status, badgeMessage } = useExtensionsBadge(extensionData);

  const extensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionData,
    };
  }, [colony?.colonyAddress, extensionData]);

  const submit = ActionTypes.EXTENSION_INSTALL;
  const error = ActionTypes.EXTENSION_INSTALL_ERROR;
  const success = ActionTypes.EXTENSION_INSTALL_SUCCESS;

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleInstallClick = useCallback(async () => {
    try {
      await asyncFunction(extensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunction, extensionValues]);

  const extensionUrl =
    extensionId === 'VotingReputation'
      ? `/colony/${colony?.name}/extensions/${extensionId}/setup`
      : `/colony/${colony?.name}/extensions/${extensionId}`;

  return {
    extensionUrl,
    handleInstallClick,
    isExtensionInstalled,
    status,
    badgeMessage,
  };
};
