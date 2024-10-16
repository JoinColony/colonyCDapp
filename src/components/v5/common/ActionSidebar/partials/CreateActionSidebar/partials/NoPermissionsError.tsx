import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { CoreAction } from '~actions';
import useHasActionPermissions from '~v5/common/ActionSidebar/hooks/permissions/useHasActionPermissions.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { useActiveActionType } from '~v5/common/ActionSidebar/hooks/useActiveActionType.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'v5.common.ActionsContent.partials.ActionSidebarContent.partials.NoPermissionsError';

const MSG = defineMessages({
  noPermissionsErrorTitle: {
    id: `${displayName}.noPermissionsErrorTitle`,
    defaultMessage: `You don't have the right permissions to create this action. Try another action type.`,
  },
});

const NoPermissionsError = () => {
  const { formatMessage } = useIntl();

  const actionType = useActiveActionType();

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  if (
    actionType &&
    actionType !== CoreAction.CreateDecisionMotion &&
    (hasNoDecisionMethods || hasPermissions === false)
  ) {
    return (
      <div className="mt-6">
        <NotificationBanner status="error" icon={WarningCircle}>
          {formatMessage(MSG.noPermissionsErrorTitle)}
        </NotificationBanner>
      </div>
    );
  }

  return null;
};

NoPermissionsError.displayName = displayName;

export default NoPermissionsError;
