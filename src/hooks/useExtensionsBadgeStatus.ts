import { Extension } from '@colony/core';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { isInstalledExtensionData } from '~utils/extensions.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';

const useExtensionsBadge = (extensionData) => {
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
      if (extensionData.extensionId === Extension.MultisigPermissions) {
        setStatus('installed');
        setBadgeMessage(formatMessage({ id: 'status.installed' }));
      } else {
        setStatus('enabled');
        setBadgeMessage(formatMessage({ id: 'status.enabled' }));
      }
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

export default useExtensionsBadge;
