import React from 'react';

import { useNotificationsDataContext } from '~context/Notifications/NotificationsDataContext/NotificationsDataContext.ts';

import CountBadge from './CountBadge.tsx';

const displayName = 'common.Extensions.UserHub.partials.UnreadNotifications';

const UnreadNotifications = () => {
  const { unreadCount } = useNotificationsDataContext();

  return <CountBadge count={unreadCount} maximum={99} />;
};

UnreadNotifications.displayName = displayName;
export default UnreadNotifications;
