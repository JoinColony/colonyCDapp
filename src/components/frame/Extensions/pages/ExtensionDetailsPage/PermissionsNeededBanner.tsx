import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';

const displayName = 'frame.Extensions.PermissionsNeededBanner';

const PermissionsNeededBanner = () => {
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);

  function getBanner() {
    if (isPermissionEnabled) {
      return (
        <NotificationBanner
          icon="check-circle"
          status="success"
          callToAction={
            <button
              type="button"
              onClick={() => {
                setIsPermissionEnabled(true);
              }}
            >
              <FormattedMessage id="extension.notification.permissions.enabled" />
            </button>
          }
        >
          <FormattedMessage id="extension.notification.permissions.updated" />
        </NotificationBanner>
      );
    }

    return (
      <NotificationBanner
        icon="warning-circle"
        status="warning"
        callToAction={
          <button
            type="button"
            onClick={() => {
              setIsPermissionEnabled(true);
            }}
          >
            <FormattedMessage id="extension.notification.permissions.enable" />
          </button>
        }
      >
        <FormattedMessage id="extension.notification.permissions.missing" />
      </NotificationBanner>
    );
  }

  return <div className="mb-6">{getBanner()}</div>;
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
