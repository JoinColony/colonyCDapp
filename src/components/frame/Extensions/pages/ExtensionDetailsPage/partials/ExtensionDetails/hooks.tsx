import React, { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { ActionTypes } from '~redux';

import { isInstalledExtensionData } from '~utils/extensions';
import { useUserByNameOrAddress, useAsyncFunction, useColonyContext, useAppContext } from '~hooks';

import { AnyExtensionData, InstalledExtensionData } from '~types';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge/types';
import { SidePanelDataProps } from '~common/Extensions/SpecificSidePanel/types';

import UserAvatar from '~shared/Extensions/UserAvatar';
import Toast from '~shared/Extensions/Toast';

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

export const useExtensionDetailsActions = (extensionData: AnyExtensionData) => {
  const deprecateSubmit = ActionTypes.EXTENSION_DEPRECATE;
  const deprecateError = ActionTypes.EXTENSION_DEPRECATE_ERROR;
  const deprecateSuccess = ActionTypes.EXTENSION_DEPRECATE_SUCCESS;
  const uninstallSubmit = ActionTypes.EXTENSION_UNINSTALL;
  const uninstallError = ActionTypes.EXTENSION_UNINSTALL_ERROR;
  const uninstallSuccess = ActionTypes.EXTENSION_UNINSTALL_SUCCESS;
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionId } = extensionData;

  const deprecateExtensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
      isToDeprecate: true,
    };
  }, [colony?.colonyAddress, extensionId]);
  const uninstallExtensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
    };
  }, [colony?.colonyAddress, extensionId]);

  const deprecateAsyncFunction = useAsyncFunction({
    submit: deprecateSubmit,
    error: deprecateError,
    success: deprecateSuccess,
  });

  const uninstallAsyncFunction = useAsyncFunction({
    submit: uninstallSubmit,
    error: uninstallError,
    success: uninstallSuccess,
  });

  const handleDeprecate = useCallback(async () => {
    try {
      await deprecateAsyncFunction(deprecateExtensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [deprecateAsyncFunction, deprecateExtensionValues]);
  const handleUninstall = useCallback(async () => {
    try {
      await uninstallAsyncFunction(uninstallExtensionValues).then(() =>
        toast.success(
          <Toast
            type="success"
            title="Extension uninstalled successfully"
            description="You can reinstall the extension at anytime"
          />,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, [uninstallAsyncFunction, uninstallExtensionValues]);

  const hasRegisteredProfile = !!user;
  const canExtensionBeUninstalled = !!(
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );
  const canExtensionBeDeprecated =
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  return { handleDeprecate, handleUninstall, canExtensionBeUninstalled, canExtensionBeDeprecated };
};
