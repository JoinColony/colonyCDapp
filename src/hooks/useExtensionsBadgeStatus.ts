import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import { isInstalledExtensionData } from '~utils/extensions';

export const useExtensionsBadge = (extensionData) => {
  const { formatMessage } = useIntl();
  const [status, setStatus] = useState<ExtensionStatusBadgeMode>();
  const [badgeMessage, setBadgeMessage] = useState<string>('');

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatus('not-installed');
      setBadgeMessage(formatMessage({ id: 'status.notInstalled' }));
    } else if (extensionData?.isDeprecated) {
      setStatus('deprecated');
      setBadgeMessage(formatMessage({ id: 'status.deprecated' }));
    } else if (extensionData?.isEnabled) {
      setStatus('enabled');
      setBadgeMessage(formatMessage({ id: 'status.enabled' }));
    } else {
      setStatus('disabled');
      setBadgeMessage(formatMessage({ id: 'status.disabled' }));
    }
  }, [extensionData, formatMessage, isExtensionInstalled]);

  return {
    status,
    badgeMessage,
  };
};
