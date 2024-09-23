import { MagicBellProvider, useBell } from '@magicbell/react-headless';
import React, { type ReactNode, useEffect, useMemo } from 'react';

import { isDev } from '~constants';
import { useCreateUserNotificationsDataMutation } from '~gql';

import { useAppContext } from '../AppContext/AppContext.ts';

import {
  NotificationsContext,
  type NotificationsContextValues,
} from './NotificationsContext.ts';

const NotificationsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { updateUser, user } = useAppContext();
  const [createUserNotificationsData] =
    useCreateUserNotificationsDataMutation();

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

  useEffect(() => {
    // If the user has loaded, and they do not currently have notifications data with a magicbell user id
    // then we assume they do not have their notifications data and Magicbell user created yet, so we call
    // the lambda to make it here, and then update the user in the app context.
    if (user && !user?.notificationsData?.magicbellUserId) {
      createUserNotificationsData({
        variables: { input: { id: user.walletAddress } },
      }).then(() => {
        updateUser(user.walletAddress, true);
      });
    }
  }, [createUserNotificationsData, updateUser, user]);

  const value = useMemo((): NotificationsContextValues => {
    return {
      canFetchMore: currentPage < totalPages,
      fetchMore: fetchNextPage,
      markAllAsRead: markAllAsRead || (() => null),
      notifications,
      mutedColonyAddresses: user?.notificationsData?.mutedColonyAddresses || [],
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
    user?.notificationsData?.mutedColonyAddresses,
  ]);

  if (!user) {
    return <>{children}</>;
  }

  if (
    !user?.notificationsData?.magicbellUserId ||
    !import.meta.env.MAGICBELL_API_KEY
  ) {
    return (
      <NotificationsContext.Provider value={value}>
        {children}
      </NotificationsContext.Provider>
    );
  }

  return (
    <MagicBellProvider
      apiKey={import.meta.env.MAGICBELL_API_KEY}
      userExternalId={user.notificationsData.magicbellUserId}
      stores={
        isDev
          ? [
              {
                id: 'dev-store',
                defaultQueryParams: {
                  category: import.meta.env.MAGICBELL_DEV_KEY,
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
            ]
      }
    >
      <NotificationsContext.Provider value={value}>
        {children}
      </NotificationsContext.Provider>
    </MagicBellProvider>
  );
};

export default NotificationsContextProvider;
