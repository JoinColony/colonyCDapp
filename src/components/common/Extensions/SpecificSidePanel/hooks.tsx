import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useIntl } from 'react-intl';

import { useUserByNameOrAddress } from '~hooks';
import { SidePanelDataProps } from './types';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import UserAvatar from '~v5/shared/UserAvatar';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';
import { isInstalledExtensionData } from '~utils/extensions';

export const useSpecificSidePanel = (extensionData: AnyExtensionData) => {
  const [statuses, setStatuses] = useState<ExtensionStatusBadgeMode[]>([
    'disabled',
  ]);
  const { formatMessage } = useIntl();

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);
  const installedAtDate =
    extensionData &&
    format(
      new Date(
        ((extensionData as InstalledExtensionData)?.installedAt ?? 0) * 1000,
      ),
      'dd MMMM yyyy',
    );

  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );
  const createdAtDate =
    extensionData &&
    format(new Date(extensionData?.createdAt ?? 0 * 1000), 'dd MMMM yyyy');

  const isExtensionDeprecatedAndDisabled = !!(
    !!user &&
    isExtensionInstalled &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatuses(['not-installed']);
    } else if (extensionData.isEnabled) {
      setStatuses(['enabled']);
    } else if (isExtensionDeprecatedAndDisabled) {
      setStatuses(['disabled', 'deprecated']);
    } else {
      setStatuses(['disabled']);
    }
  }, [extensionData, isExtensionInstalled, isExtensionDeprecatedAndDisabled]);

  // @ts-expect-error CurrentVersion/Address aren't shown in the parent if the extension is not installed
  const { availableVersion, currentVersion, address, neededColonyPermissions } =
    extensionData;

  const sidePanelData: SidePanelDataProps[] = useMemo(
    () => [
      {
        id: 0,
        statusType: {
          title: formatMessage({ id: 'status' }),
        },
        latestVersion: {
          title: formatMessage({ id: 'latest.version' }),
          version: `v${availableVersion}`,
        },
        dateInstalled: {
          title: formatMessage({ id: 'date.installed' }),
          date: installedAtDate,
        },
        dateCreated: {
          title: formatMessage({ id: 'date.created' }),
          date: createdAtDate,
        },
        installedBy: {
          title: formatMessage({ id: 'installed.by' }),
          component: user ? <UserAvatar user={user} /> : null,
          user,
        },
        versionInstalled: {
          title: formatMessage({ id: 'version.installed' }),
          version: `v${currentVersion}`,
        },
        contractAddress: {
          title: formatMessage({ id: 'contract.address' }),
          address,
        },
        developer: {
          title: formatMessage({ id: 'developer' }),
          developer: 'Colony',
        },
        permissions: neededColonyPermissions,
      },
    ],
    [
      formatMessage,
      availableVersion,
      installedAtDate,
      createdAtDate,
      user,
      currentVersion,
      address,
      neededColonyPermissions,
    ],
  );

  return {
    sidePanelData,
    statuses,
  };
};
