import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAsyncFunction, useColonyContext, useExtensionData } from '~hooks';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge-new/types';
import { ActionTypes } from '~redux';
import { isInstalledExtensionData } from '~utils/extensions';

export const useExtensionItem = (extensionId: string) => {
  const { formatMessage } = useIntl();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId);
  const [status, setStatus] = useState<ExtensionStatusBadgeMode>();
  const [badgeMessage, setBadgeMessage] = useState<string>('');

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

  const extensionUrl = `/colony/${colony?.name}/extensions/${extensionId}`;
  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatus('not-installed');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.notInstalled' }));
    } else if (extensionData?.isDeprecated) {
      setStatus('deprecated');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.deprecated' }));
    } else if (extensionData?.isEnabled) {
      setStatus('enabled');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.enabled' }));
    } else {
      setStatus('disabled');
      setBadgeMessage(formatMessage({ id: 'extensionsPage.disabled' }));
    }
  }, [extensionData, formatMessage, isExtensionInstalled]);

  return {
    extensionUrl,
    handleInstallClick,
    isExtensionInstalled,
    status,
    badgeMessage,
  };
};
