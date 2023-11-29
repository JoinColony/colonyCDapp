import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ActionTypes } from '~redux';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';
import { getFormAction } from '~utils/actions';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';

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
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const errorAction = getFormAction(ActionTypes.EXTENSION_ENABLE, 'ERROR');
  const successAction = getFormAction(ActionTypes.EXTENSION_ENABLE, 'SUCCESS');

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: errorAction,
    success: successAction,
  });

  const onClick = async () => {
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

  return (
    <div className="mb-6">
      <NotificationBanner
        title={
          <FormattedMessage
            {...(isPermissionEnabled
              ? MSG.updatedPermission
              : MSG.missingPermission)}
          />
        }
        status={isPermissionEnabled ? 'success' : 'warning'}
        action={
          !isPermissionEnabled
            ? {
                type: 'call-to-action',
                actionText: <FormattedMessage {...MSG.enablePermission} />,
                onClick,
              }
            : undefined
        }
      />
    </div>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
