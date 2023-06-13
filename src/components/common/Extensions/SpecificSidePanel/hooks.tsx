import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';

import { useUserByNameOrAddress } from '~hooks';
import { SidePanelDataProps } from './types';
import { InstalledExtensionData } from '~types';
import UserAvatar from '~shared/Extensions/UserAvatar';
import { ExtensionStatusBadgeMode } from '../ExtensionStatusBadge/types';
import { isInstalledExtensionData } from '~utils/extensions';

export const useSpecificSidePanel = (extensionData) => {
  const [statuses, setStatuses] = useState<
    ExtensionStatusBadgeMode | ExtensionStatusBadgeMode[]
  >('disabled');
  const { formatMessage } = useIntl();

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);
  const installedAtDate =
    extensionData &&
    format(
      new Date(
        (extensionData as InstalledExtensionData)?.installedAt ?? 0 * 1000,
      ),
      'dd MMMM yyyy',
    );

  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );

  const isExtensionDeprecatedAndDisabled = !!(
    !!user &&
    isExtensionInstalled &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatuses('not-installed');
    } else if (extensionData.isEnabled) {
      setStatuses('enabled');
    } else if (isExtensionDeprecatedAndDisabled) {
      setStatuses(['disabled', 'deprecated']);
    } else {
      setStatuses('disabled');
    }
  }, [extensionData, isExtensionInstalled, isExtensionDeprecatedAndDisabled]);

  const sidePanelData: SidePanelDataProps[] = useMemo(
    () => [
      {
        id: 0,
        statusType: {
          title: formatMessage({ id: 'status' }),
        },
        dateInstalled: {
          title: formatMessage({ id: 'date.installed' }),
          date: installedAtDate,
        },
        installedBy: {
          title: formatMessage({ id: 'installed.by' }),
          component: <UserAvatar user={user} />,
          user,
        },
        versionInstalled: {
          title: formatMessage({ id: 'version.installed' }),
          version: `v${extensionData?.availableVersion}`,
        },
        contractAddress: {
          title: formatMessage({ id: 'contract.address' }),
          address: (extensionData as InstalledExtensionData).address,
        },
        developer: {
          title: formatMessage({ id: 'developer' }),
          developer: 'Colony',
        },
        permissions: (extensionData as InstalledExtensionData).permissions,
      },
    ],
    [extensionData, installedAtDate, user, formatMessage],
  );

  return {
    sidePanelData,
    statuses,
  };
};
