import { MagicBellProvider } from '@magicbell/react-headless';
import React, { type ReactNode, useEffect, useMemo } from 'react';

import { isDev } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCreateUserNotificationsDataMutation } from '~gql';

import NotificationsDataContextProvider from '../NotificationsDataContext/NotificationsDataContextProvider.tsx';

import {
  NotificationsUserContext,
  type NotificationsUserContextValues,
} from './NotificationsUserContext.ts';

const NotificationsUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { updateUser, user } = useAppContext();
  const [createUserNotificationsData] =
    useCreateUserNotificationsDataMutation();

  const areNotificationsEnabled = useMemo(
    () => user?.notificationsData?.notificationsDisabled === false,
    [user?.notificationsData?.notificationsDisabled],
  );

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

  const value = useMemo((): NotificationsUserContextValues => {
    return {
      mutedColonyAddresses: user?.notificationsData?.mutedColonyAddresses || [],
      areNotificationsEnabled,
    };
  }, [user?.notificationsData?.mutedColonyAddresses, areNotificationsEnabled]);

  if (!user) {
    return <>{children}</>;
  }

  if (
    !user?.notificationsData?.magicbellUserId ||
    !import.meta.env.MAGICBELL_API_KEY
  ) {
    return (
      <NotificationsUserContext.Provider value={value}>
        {children}
      </NotificationsUserContext.Provider>
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
      <NotificationsUserContext.Provider value={value}>
        <NotificationsDataContextProvider>
          {children}
        </NotificationsDataContextProvider>
      </NotificationsUserContext.Provider>
    </MagicBellProvider>
  );
};

export default NotificationsUserContextProvider;
