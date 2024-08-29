import { ProjectClient } from 'magicbell/project-client';
import React, { type ReactNode, useCallback, useEffect, useMemo } from 'react';

import { useCreateNotificationsDataMutation } from '~gql';

import { useAppContext } from '../AppContext/AppContext.ts';

import { NotificationsContext } from './NotificationsContext.ts';

const magicbell = new ProjectClient({
  apiKey: '90a1a7bb0a1f563319e9375fdde7ce9c478ec336',
  apiSecret: 'u/bLbHf56Qa798VxD4OkUs6OXD1YcRXUriCKDIKQ',
});

const NotificationsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAppContext();
  const [createNotificationsData] = useCreateNotificationsDataMutation();

  const createMagicbellUser = useCallback(async () => {
    if (!user?.walletAddress) {
      return;
    }

    await magicbell.users
      .create({
        // eslint-disable-next-line camelcase
        external_id: user?.walletAddress,
      })
      .then(() => {
        createNotificationsData({
          variables: {
            input: {
              userId: user.walletAddress,
              magicbellUserId: user.walletAddress,
              id: user.walletAddress,
            },
          },
        });
      })
      .catch(() => {
        console.error('Error creating Magicbell user');
      });
  }, [createNotificationsData, user?.walletAddress]);

  useEffect(() => {
    if (user && !user?.notificationsData?.magicbellUserId) {
      createMagicbellUser();
    }
  }, [createMagicbellUser, user]);

  const value = useMemo(() => ({}), []);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
