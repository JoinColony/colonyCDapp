import { CheckCircle } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'frame.Extensions.ExtensionDetailsPage.PermissionsEnabledBanner';

const MSG = defineMessages({
  updatedPermission: {
    id: `${displayName}.updatedPermission`,
    defaultMessage: 'The required permissions have been updated.',
  },
});

const PermissionsEnabledBanner = () => {
  return (
    <NotificationBanner icon={CheckCircle} status="success" className="mb-6">
      <FormattedMessage {...MSG.updatedPermission} />
    </NotificationBanner>
  );
};

PermissionsEnabledBanner.displayName = displayName;

export default PermissionsEnabledBanner;
