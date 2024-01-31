import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { usePermissionsValidation } from '~v5/common/ActionSidebar/hooks/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'v5.common.ActionsContent.partials.ActionSidebarContent.partials.NoPermissionsError';

const MSG = defineMessages({
  noPermissionsErrorTitle: {
    id: `${displayName}.noPermissionsErrorTitle`,
    defaultMessage: `You don't have the right permissions to create this action type. Choose another action.`,
  },
});

const NoPermissionsError = () => {
  const { formatMessage } = useIntl();

  const { noPermissionsError } = usePermissionsValidation();

  if (!noPermissionsError) {
    return null;
  }

  return (
    <div className="mt-6">
      <NotificationBanner status="warning" icon={WarningCircle}>
        {formatMessage(MSG.noPermissionsErrorTitle)}
      </NotificationBanner>
    </div>
  );
};

NoPermissionsError.displayName = displayName;

export default NoPermissionsError;
