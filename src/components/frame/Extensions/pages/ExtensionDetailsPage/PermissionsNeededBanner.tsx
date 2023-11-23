import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';

const displayName = 'frame.Extensions.PermissionsNeededBanner';

const PermissionsNeededBanner = () => {
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  const enablePermissionsButton = (
    <button type="button" onClick={() => setIsPermissionEnabled(true)}>
      {isPermissionEnabled ? (
        <FormattedMessage id="extension.notification.permissions.enabled" />
      ) : (
        <FormattedMessage id="extension.notification.permissions.enable" />
      )}
    </button>
  );

  return (
    <div className="mb-6">
      <NotificationBanner
        icon={isPermissionEnabled ? 'check-circle' : 'warning-circle'}
        status={isPermissionEnabled ? 'success' : 'warning'}
        callToAction={enablePermissionsButton}
      >
        <FormattedMessage
          id={
            isPermissionEnabled
              ? 'extension.notification.permissions.updated'
              : 'extension.notification.permissions.missing'
          }
        />
      </NotificationBanner>
    </div>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
