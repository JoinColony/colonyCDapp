import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';

const displayName = 'frame.Extensions.PermissionsNeededBanner';

const PermissionsNeededBanner = () => {
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
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
          onClick: () => setIsPermissionEnabled(true),
        }}
      />
    </div>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
