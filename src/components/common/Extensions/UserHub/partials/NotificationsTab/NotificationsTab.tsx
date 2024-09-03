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
              title={{ id: 'empty.content.title.notifications' }}
              description={{ id: 'empty.content.subtitle.notifications' }}
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
