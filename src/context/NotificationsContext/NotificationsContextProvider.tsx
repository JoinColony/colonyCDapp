import { MagicBellProvider } from '@magicbell/react-headless';
import React, { type ReactNode, useEffect, useMemo } from 'react';

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

  const value: NotificationsContextValues = useMemo(
    () => ({
      mutedColonyAddresses: user?.notificationsData?.mutedColonyAddresses || [],
    }),
    [user?.notificationsData?.mutedColonyAddresses],
  );

  if (!user) {
    return <>{children}</>;
  }

  if (!user?.notificationsData?.magicbellUserId) {
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
    >
      <NotificationsContext.Provider value={value}>
        {children}
      </NotificationsContext.Provider>
    </MagicBellProvider>
  );
};

export default NotificationsContextProvider;
