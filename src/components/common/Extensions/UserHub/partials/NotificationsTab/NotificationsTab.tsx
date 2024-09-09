import { Binoculars } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

const displayName = 'common.Extensions.UserHub.partials.NotificationsTab';

const MSG = defineMessages({
  notifications: {
    id: `${displayName}.notifications`,
    defaultMessage: 'Notifications',
  },
  emptyTitle: {
    id: `${displayName}.emptyTitle`,
    defaultMessage: 'No notifications yet',
  },
  emptyDescription: {
    id: `${displayName}.emptyDescription`,
    defaultMessage: 'Your notifications will appear here.',
  },
});

const NotificationsTab = () => {
  const isEmpty = true;

  return (
    <div className="h-full px-6 pb-6 pt-6 sm:pb-2">
      <p className="heading-5">{formatText(MSG.notifications)}</p>
      <div className="flex h-full flex-col justify-center pt-4 sm:h-auto sm:justify-normal">
        {isEmpty && (
          <>
            <EmptyContent
              title={formatText(MSG.emptyTitle)}
              description={formatText(MSG.emptyDescription)}
              icon={Binoculars}
              className="sm:pt-[100px]"
            />
            <div className="h-[25%] sm:h-0" />
          </>
        )}
      </div>
    </div>
  );
};

NotificationsTab.displayName = displayName;

export default NotificationsTab;
