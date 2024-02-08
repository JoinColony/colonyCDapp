import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { useWatch } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { type DecisionMethod } from '~types/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import {
  useHasActionPermissions,
  useHasNoDecisionMethods,
} from '~v5/common/ActionSidebar/hooks/index.ts';
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

  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();
  // Hide the banner if user has permissions, or if the decision method is not set
  if (hasPermissions !== false || (!decisionMethod && !hasNoDecisionMethods)) {
    return null;
  }

  return (
    <div className="mt-6">
      <NotificationBanner status="error" icon={WarningCircle}>
        {formatMessage(MSG.noPermissionsErrorTitle)}
      </NotificationBanner>
    </div>
  );
};

NoPermissionsError.displayName = displayName;

export default NoPermissionsError;
