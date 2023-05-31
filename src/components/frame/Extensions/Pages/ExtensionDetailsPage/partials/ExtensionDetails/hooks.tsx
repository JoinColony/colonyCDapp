import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';
import { isInstalledExtensionData } from '~utils/extensions';
import { useUserByNameOrAddress } from '~hooks';
import UserAvatar from '~shared/Extensions/UserAvatar';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import { SidePanelDataProps } from '~common/Extensions/SpecificSidePanel/types';

export const useExtensionDetails = (extensionData: AnyExtensionData) => {
  const [status, setStatus] = useState<ExtensionStatusBadgeMode>('disabled');

  const installedExtensionData = extensionData as InstalledExtensionData;
  const isExtensionInstalled = isInstalledExtensionData(extensionData);
  const { user } = useUserByNameOrAddress(installedExtensionData.installedBy);
  const { profile } = user || {};

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatus('not-installed');
    } else if (extensionData.isDeprecated) {
      setStatus('deprecated');
    } else if (extensionData.isEnabled) {
      setStatus('enabled');
    } else {
      setStatus('disabled');
    }
  }, [extensionData, isExtensionInstalled]);

  const installedAtDate =
    installedExtensionData.installedAt && format(new Date(installedExtensionData.installedAt * 1000), 'dd MMMM yyyy');

  const sidePanelData: SidePanelDataProps[] = [
    {
      id: 0,
      statusType: {
        title: 'Status',
      },
      dateInstalled: {
        title: 'Date installed',
        date: installedAtDate,
      },
      installedBy: {
        title: 'Installed by',
        component: <UserAvatar user={user} userName={profile?.displayName || ''} />,
      },
      versionInstalled: {
        title: 'Version installed',
        version: `v${extensionData.availableVersion}`,
      },
      contractAddress: {
        title: 'Contract address',
        address: installedExtensionData.address,
      },
      developer: {
        title: 'Developer',
        developer: 'Colony',
      },
      permissions: extensionData.permissions,
    },
  ];

  return { status, sidePanelData };
};
