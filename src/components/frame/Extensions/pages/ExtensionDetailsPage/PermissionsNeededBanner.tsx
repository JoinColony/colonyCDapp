import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ActionTypes } from '~redux';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';
import { getFormAction } from '~utils/actions';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';

const displayName = 'frame.Extensions.PermissionsNeededBanner';

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
            id={
              isPermissionEnabled
                ? 'extension.notification.permissions.updated'
                : 'extension.notification.permissions.missing'
            }
          />
        }
        status={isPermissionEnabled ? 'success' : 'warning'}
        action={{
          type: 'call-to-action',
          actionText: isPermissionEnabled ? (
            <FormattedMessage id="extension.notification.permissions.enabled" />
          ) : (
            <FormattedMessage id="extension.notification.permissions.enable" />
          ),
          onClick,
        }}
      />
    </div>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
