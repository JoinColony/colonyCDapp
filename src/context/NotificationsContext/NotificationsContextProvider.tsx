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
