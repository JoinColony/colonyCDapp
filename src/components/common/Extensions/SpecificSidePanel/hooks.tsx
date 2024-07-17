import { Extension } from '@colony/core';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import useUserByNameOrAddress from '~hooks/useUserByNameOrAddress.ts';
import {
  type AnyExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { type ExtensionStatusBadgeMode } from '~v5/common/Pills/types.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { type SidePanelDataProps } from './types.ts';

export const useSpecificSidePanel = (extensionData: AnyExtensionData) => {
  const { formatMessage } = useIntl();
  const [statuses, setStatuses] = useState<ExtensionStatusBadgeMode[]>([
    'disabled',
  ]);
  const [badgeMessages, setBadgeMessages] = useState<string[]>([
    formatMessage({ id: 'status.disabled' }),
  ]);

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);
  const installedAtDate =
    extensionData &&
    getFormattedDateFrom(
      new Date(
        ((extensionData as InstalledExtensionData)?.installedAt ?? 0) * 1000,
      ),
    );

  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );
  const createdAtDate =
    extensionData && getFormattedDateFrom(extensionData?.createdAt ?? 0 * 1000);

  const isExtensionDeprecatedAndDisabled = !!(
    !!user &&
    isExtensionInstalled &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );

  useMemo(() => {
    if (!isExtensionInstalled) {
      setStatuses(['not-installed']);
      setBadgeMessages([formatMessage({ id: 'status.notInstalled' })]);
    } else if (extensionData.isEnabled) {
      if (extensionData.extensionId === Extension.MultisigPermissions) {
        setStatuses(['installed']);
        setBadgeMessages([formatMessage({ id: 'status.installed' })]);
      } else {
        setStatuses(['enabled']);
        setBadgeMessages([formatMessage({ id: 'status.enabled' })]);
      }
    } else if (isExtensionDeprecatedAndDisabled) {
      setStatuses(['disabled', 'deprecated']);
      setBadgeMessages([
        formatMessage({ id: 'status.disabled' }),
        formatMessage({ id: 'status.deprecated' }),
      ]);
    } else {
      setStatuses(['disabled']);
      setBadgeMessages([formatMessage({ id: 'status.disabled' })]);
    }
  }, [
    extensionData,
    isExtensionInstalled,
    isExtensionDeprecatedAndDisabled,
    formatMessage,
  ]);

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
    badgeMessages,
  };
};
