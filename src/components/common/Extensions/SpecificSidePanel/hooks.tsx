import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import useUserByNameOrAddress from '~hooks/useUserByNameOrAddress.ts';
import {
  type AnyExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { DEFAULT_DATE_FORMAT } from '~v5/common/Fields/datepickers/common/consts.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { type SidePanelDataProps } from './types.ts';

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
      DEFAULT_DATE_FORMAT,
    );

  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );
  const createdAtDate =
    extensionData &&
    format(new Date(extensionData?.createdAt ?? 0 * 1000), DEFAULT_DATE_FORMAT);

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
          component: user ? (
            <UserAvatar
              size={20}
              userAvatarSrc={user.profile?.avatar ?? undefined}
              userName={user.profile?.displayName ?? undefined}
              userAddress={user.walletAddress}
            />
          ) : null,
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
