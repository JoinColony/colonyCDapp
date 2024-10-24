import React from 'react';
import { type FC, type PropsWithChildren } from 'react';

import { useNotificationsUserContext } from '~context/Notifications/NotificationsUserContext/NotificationsUserContext.ts';

const displayName = 'v5.common.NotificationsEnabledWrapper';

interface NotificationsEnabledWrapperProps extends PropsWithChildren {}

/* This component basically does the following:
 * If user has notifications enabled, it renders whatever children
 * If not, it returns null
 * check NotificationsUserContextProvider for implementation details, there is no NotificationsDataContext if user's notifications are disabled
 */

const NotificationsEnabledWrapper: FC<NotificationsEnabledWrapperProps> = ({
  children,
}) => {
  const { areNotificationsEnabled } = useNotificationsUserContext();

  if (!areNotificationsEnabled) {
    return null;
  }

  return <>{children}</>;
};

NotificationsEnabledWrapper.displayName = displayName;
export default NotificationsEnabledWrapper;
