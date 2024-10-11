import React from 'react';

import { useNotificationsDataContext } from '~context/Notifications/NotificationsDataContext/NotificationsDataContext.ts';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import Notification from './Notification/Notification.tsx';

const displayName = 'common.Extensions.UserHub.partials.NotificationsList';

const NotificationsList = ({ closeUserHub }: { closeUserHub: () => void }) => {
  const { notifications } = useNotificationsDataContext();

  return (
    <ul className="w-full">
      {notifications.map((notification) => (
        <Notification
          notification={notification as NotificationInterface}
          key={notification.id}
          closeUserHub={closeUserHub}
        />
      ))}
    </ul>
  );
};

NotificationsList.displayName = displayName;

export default NotificationsList;
