import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';

import { ActionTypes } from '~redux';
import { getFormAction } from '~utils/actions';
import { useAppContext, useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import NotificationBanner from '~v5/shared/NotificationBanner';
import { addressHasRoles } from '~utils/checks';

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
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const errorAction = getFormAction(ActionTypes.EXTENSION_ENABLE, 'ERROR');
  const successAction = getFormAction(ActionTypes.EXTENSION_ENABLE, 'SUCCESS');
  const userHasRoles = addressHasRoles({
    requiredRolesDomains: [Id.RootDomain],
    colony,
    requiredRoles: [ColonyRole.Root],
    address: user?.walletAddress || '',
  });

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: errorAction,
    success: successAction,
  });

  const handleEnableClick = async () => {
    try {
      await asyncFunction({
        colonyAddress: colony?.colonyAddress,
        extensionData,
      });
      setIsPermissionEnabled(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getBanner = () => {
    if (isPermissionEnabled) {
      return (
        <NotificationBanner icon="check-circle" status="success">
          <FormattedMessage {...MSG.updatedPermission} />
        </NotificationBanner>
      );
    }

    return (
      <NotificationBanner
        icon="warning-circle"
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

  return <div className="mb-6">{getBanner()}</div>;
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
