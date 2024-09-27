import { useBell } from '@magicbell/react-headless';
import React, { type ReactNode, useMemo } from 'react';

import { isDev } from '~constants';

import {
  NotificationsDataContext,
  type NotificationsDataContextValues,
} from './NotificationsDataContext.ts';

const NotificationsDataContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    currentPage,
    fetchNextPage,
    markAllAsRead,
    notifications,
    totalPages,
    unreadCount,
  } = useBell({ storeId: isDev ? 'dev-store' : 'store' }) || {
    currentPage: 1,
    fetchNextPage: () => Promise.resolve(),
    markAllAsRead: () => null,
    notifications: [],
    totalPages: 1,
    unreadCount: 0,
  };

  const value = useMemo((): NotificationsDataContextValues => {
    return {
      canFetchMore: currentPage < totalPages,
      fetchMore: fetchNextPage,
      markAllAsRead: markAllAsRead || (() => null),
      notifications,
      totalPages,
      unreadCount,
    };
  }, [
    currentPage,
    fetchNextPage,
    markAllAsRead,
    notifications,
    totalPages,
    unreadCount,
  ]);

  return (
    <NotificationsDataContext.Provider value={value}>
      {children}
    </NotificationsDataContext.Provider>
  );
};

export default NotificationsDataContextProvider;
