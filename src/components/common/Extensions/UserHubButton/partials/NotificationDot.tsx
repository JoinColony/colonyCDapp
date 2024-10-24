import React from 'react';

import { useNotificationsDataContext } from '~context/Notifications/NotificationsDataContext/NotificationsDataContext.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.UserHubButton.partials.NotificationDot';

const NotificationDot = () => {
  const { unreadCount } = useNotificationsDataContext();

  const showNotificationDot = !!unreadCount && unreadCount > 0;

  if (showNotificationDot) {
    return (
      <div className="absolute right-[-1.26px] top-[2.28px] h-2.5 w-2.5 rounded-full border border-base-white bg-blue-400" />
    );
  }

  return null;
};

NotificationDot.displayName = displayName;
export default NotificationDot;
