import { ColonyRole, Extension, Id } from '@colony/colony-js';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { useCheckExtensionEnabled } from './hooks.ts';

const displayName =
  'frame.Extensions.ExtensionDetailsPage.PermissionsNeededBanner';

const MSG = defineMessages({
  updatedPermission: {
    id: `${displayName}.updatedPermission`,
    defaultMessage: 'The required permissions have been updated.',
  },
  missingPermission: {
    id: `${displayName}.missingPermission`,
    defaultMessage:
      'This extension is missing some or all of the permissions it needs to work.',
  },
  enablePermission: {
    id: `${displayName}.enablePermission`,
    defaultMessage: 'Enable permissions',
  },
});

interface Props {
  extensionData: AnyExtensionData;
}

const PermissionsNeededBanner = ({ extensionData }: Props) => {
  const shouldDisplay =
    extensionData.extensionId !== Extension.MultisigPermissions;
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { checkExtensionEnabled } = useCheckExtensionEnabled(
    extensionData.extensionId ?? '',
  );
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const userHasRoles = addressHasRoles({
    requiredRolesDomains: [Id.RootDomain],
    colony,
    requiredRoles: [ColonyRole.Root],
    address: user?.walletAddress || '',
  });

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
  });

  const enableAndCheckStatus = async () => {
    await asyncFunction({
      colonyAddress: colony.colonyAddress,
      extensionData,
    });
    await checkExtensionEnabled();
  };

  const handleEnableClick = async () => {
    try {
      await enableAndCheckStatus();
      setIsPermissionEnabled(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (extensionData.extensionId === Extension.MultisigPermissions) {
      if (colony.colonyAddress) {
        // Enable Extension.MultisigPermissions by default
        enableAndCheckStatus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData.extensionId, colony.colonyAddress]);

  const getBanner = () => {
    if (isPermissionEnabled) {
      return (
        <NotificationBanner icon={CheckCircle} status="success">
          <FormattedMessage {...MSG.updatedPermission} />
        </NotificationBanner>
      );
    }

    return (
      <NotificationBanner
        icon={WarningCircle}
        status="warning"
        callToAction={
          userHasRoles && (
            <button type="button" onClick={handleEnableClick}>
              <FormattedMessage {...MSG.enablePermission} />
            </button>
          )
        }
      >
        <FormattedMessage {...MSG.missingPermission} />
      </NotificationBanner>
    );
  };

  return shouldDisplay ? <div className="mb-6">{getBanner()}</div> : null;
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
