import React, { type ReactNode, useEffect, useMemo } from 'react';

import { useCreateUserNotificationsDataMutation } from '~gql';

import { useAppContext } from '../AppContext/AppContext.ts';

import { NotificationsContext } from './NotificationsContext.ts';

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

  const value = useMemo(() => ({}), []);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
