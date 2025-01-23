import { MagicBellProvider, useBell } from '@magicbell/react-headless';
import React, { type ReactNode, useMemo } from 'react';

import { isDev } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetUserNotificationsHmacQuery } from '~gql';

import {
  NotificationsDataContext,
  type NotificationsDataContextValues,
} from './NotificationsDataContext.ts';

const STORES =
  isDev && !!import.meta.env.MAGICBELL_DEV_KEY
    ? [
        {
          id: 'dev-store',
          defaultQueryParams: {
            topic: import.meta.env.MAGICBELL_DEV_KEY,
            // eslint-disable-next-line camelcase
            per_page: 10,
          },
        },
      ]
    : [
        {
          id: 'store',
          // eslint-disable-next-line camelcase
          defaultQueryParams: { per_page: 10 },
        },
      ];

const USE_BELL_OPTS = { storeId: isDev ? 'dev-store' : 'store' };

const NotificationsDataContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAppContext();
  const { data, loading } = useGetUserNotificationsHmacQuery();

  const {
    currentPage,
    fetchNextPage,
    markAllAsRead,
    notifications,
    totalPages,
    unreadCount,
  } = useBell(USE_BELL_OPTS) || {
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

  if (
    !user?.notificationsData?.magicbellUserId ||
    !import.meta.env.MAGICBELL_API_KEY ||
    loading
  ) {
    return (
      <NotificationsDataContext.Provider value={value}>
        {children}
      </NotificationsDataContext.Provider>
    );
  }

  // @NOTE it tripped me up, but it's not an actual provider and this thing works without wrapping it in another provider
  return (
    <MagicBellProvider
      apiKey={import.meta.env.MAGICBELL_API_KEY}
      userExternalId={user.notificationsData.magicbellUserId}
      userKey={data?.getUserNotificationsHMAC || ''}
      stores={STORES}
    >
      <NotificationsDataContext.Provider value={value}>
        {children}
      </NotificationsDataContext.Provider>
    </MagicBellProvider>
  );
};

export default NotificationsDataContextProvider;
