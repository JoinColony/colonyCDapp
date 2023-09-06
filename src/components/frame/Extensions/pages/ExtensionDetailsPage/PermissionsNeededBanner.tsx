import React, { useState } from 'react';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';

const displayName = 'frame.Extensions.PermissionsNeededBanner';

const PermissionsNeededBanner = () => {
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);
  return (
    <div className="mb-6">
      <NotificationBanner
        title={
          isPermissionEnabled
            ? { id: 'extension.notification.permissions.updated' }
            : { id: 'extension.notification.permissions.missing' }
        }
        status={isPermissionEnabled ? 'success' : 'warning'}
        action={{
          type: 'call-to-action',
          actionText: isPermissionEnabled
            ? { id: 'extension.notification.permissions.enabled' }
            : { id: 'extension.notification.permissions.enable' },
          onClick: () => setIsPermissionEnabled(true),
        }}
      />
    </div>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
