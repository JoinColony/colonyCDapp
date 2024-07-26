import { Extension } from '@colony/core';
import { useMemo, useState } from 'react';

import { isInstalledExtensionData } from '~utils/extensions.ts';
import { type AvailableExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';

const useExtensionsBadge = (extensionData) => {
  const [status, setStatus] =
    useState<AvailableExtensionStatusBadgeMode>('not-installed');

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatus('not-installed');
    } else if (extensionData?.isDeprecated) {
      setStatus('deprecated');
    } else if (extensionData?.isEnabled) {
      if (extensionData.extensionId === Extension.MultisigPermissions) {
        setStatus('installed');
      } else {
        setStatus('enabled');
      }
    } else {
      setStatus('disabled');
    }
  }, [extensionData, isExtensionInstalled]);

  return {
    status,
  };
};

export default useExtensionsBadge;
