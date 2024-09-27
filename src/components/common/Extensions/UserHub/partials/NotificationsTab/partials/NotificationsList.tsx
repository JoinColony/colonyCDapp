import React from 'react';

import { useNotificationsDataContext } from '~context/Notifications/NotificationsDataContext/NotificationsDataContext.ts';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import Notification from './Notification/Notification.tsx';

const displayName = 'common.Extensions.UserHub.partials.NotificationsList';

const NotificationsList = () => {
  const { notifications } = useNotificationsDataContext();

  return (
    <ul className="w-full">
      {notifications.map((notification) => (
        <Notification
          notification={notification as NotificationInterface}
          key={notification.id}
        />
      ))}
    </ul>
  );
};

NotificationsList.displayName = displayName;

export default NotificationsList;
