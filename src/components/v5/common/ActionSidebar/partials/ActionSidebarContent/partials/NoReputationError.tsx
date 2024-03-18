import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import useReputationValidation from '~v5/common/ActionSidebar/hooks/useReputationValidation.ts';
import Link from '~v5/shared/Link/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'v5.common.ActionsContent.partials.ActionSidebarContent.partials.NoReputationError';

const MSG = defineMessages({
  noReputationErrorTitle: {
    id: `${displayName}.noReputationErrorTitle`,
    defaultMessage: 'There is no reputation in this team yet',
  },
  noReputationError: {
    id: `${displayName}.noReputationError`,
    defaultMessage:
      'If you have the necessary permissions you can bypass the governance process.',
  },
});

const NoReputationError = () => {
  const { formatMessage } = useIntl();

  const { noReputationError } = useReputationValidation();

  if (!noReputationError) {
    return null;
  }

  return (
    <div className="mt-6">
      <NotificationBanner
        status="warning"
        icon={WarningCircle}
        description={formatMessage(MSG.noReputationError)}
        callToAction={
          <Link to="https://docs.colony.io/use/reputation">
            {formatMessage({ id: 'text.learnMore' })}
          </Link>
        }
      >
        {formatMessage(MSG.noReputationErrorTitle)}
      </NotificationBanner>
    </div>
  );
};

NoReputationError.displayName = displayName;

export default NoReputationError;
