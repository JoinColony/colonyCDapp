import React, { useEffect, useState } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  getToken,
  Messaging,
  deleteToken,
} from 'firebase/messaging';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import {
  useSubscribeToColonyPushNotificationsMutation,
  useGetUserNotificationsQuery,
  useUpdateUserProfileMutation,
} from '~gql';
import Toast from '~shared/Extensions/Toast';
import { notNull } from '~utils/arrays';
import { useAppContext } from '~hooks';
import { excludeTypenameKey } from '~utils/objects';

const vapidKey = process.env.VAPID_KEY;

const firebaseConfig = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : {};

export const useNotifications = (colonyId?: string) => {
  const { updateUser, user } = useAppContext();
  const { formatMessage } = useIntl();
  const [subscribeToColonyPushNotifications] =
    useSubscribeToColonyPushNotificationsMutation();
  const [editUser] = useUpdateUserProfileMutation();

  const [userAddress, setUserAddress] = useState(user?.walletAddress);
  const [cachedMessaging, setCachedMessaging] = useState<Messaging>();

  useEffect(() => setUserAddress(user?.walletAddress), [user]);

  const {
    data,
    loading: loadingNotifications,
    refetch,
  } = useGetUserNotificationsQuery({
    variables: {
      id: userAddress ?? '',
      colonyId,
    },
    skip: !userAddress,
  });

  const notifications = data?.notificationsByDate?.items.filter(notNull) ?? [];
  const notificationSettings = excludeTypenameKey(
    user?.profile?.notificationSettings ?? {},
  );

  // NOTE: This needs to change as is a user has agreed to permissions
  // once and changes their mind this will always be true
  const pushNotificationsEnabledForDevice =
    Notification.permission === 'granted';

  const emailEnabledForUser = notificationSettings?.enableEmail || false;

  useEffect(() => {
    async function setupNotifications() {
      try {
        // Check if the Firebase app have been initialized
        getApp();
      } catch {
        initializeApp(firebaseConfig); // Only initialize if no apps have been initialized
      }

      // Handle incoming messages. Called when:
      // - a message is received while the app has focus
      // - the user clicks on an app notification created by a service worker
      //   `messaging.onBackgroundMessage` handler.
      const messaging = getMessaging();
      setCachedMessaging(messaging);

      onMessage(messaging, (payload) => {
        refetch();
        toast.success(
          <Toast
            type="success"
            title={payload.data?.title}
            description={payload.data?.body}
          />,
        );
      });
    }
    setupNotifications();
  }, []);

  const filterNotificationsByColony = (filterByColony: string) => {
    refetch({ id: userAddress, colonyId: filterByColony });
  };

  const enablePushNotifications = async (enable: boolean) => {
    try {
      if (!cachedMessaging || !userAddress) {
        return;
      }

      const notificationTokens = notificationSettings?.notificationTokens || [];

      if (enable) {
        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        const currentToken = await getToken(cachedMessaging, { vapidKey });

        if (currentToken) {
          if (notificationTokens.includes(currentToken)) {
            return;
          }

          await editUser({
            variables: {
              input: {
                id: userAddress,
                notificationSettings: {
                  ...notificationSettings,
                  notificationTokens: [...notificationTokens, currentToken],
                },
              },
            },
          });

          updateUser?.(user?.walletAddress, true);

          toast.success(
            <Toast
              type="success"
              title="Success"
              description="Registered for push notifications"
            />,
          );
        } else {
          // No registration token available.
          // Permission is requested to generate one and allow notifications.
        }
      } else {
        const currentToken = await getToken(cachedMessaging, { vapidKey });

        await deleteToken(cachedMessaging);

        await editUser({
          variables: {
            input: {
              id: userAddress,
              notificationSettings: {
                ...notificationSettings,
                notificationTokens: notificationTokens.filter(
                  (token) => token !== currentToken,
                ),
              },
            },
          },
        });

        updateUser?.(user?.walletAddress, true);
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      toast.error(
        <Toast
          type="error"
          title="Error"
          description={formatMessage({ id: 'error.message' })}
        />,
      );
    }
  };

  const enableEmailNotifications = async (enable: boolean) => {
    if (!userAddress) {
      throw new Error('now user address defined');
    }
    try {
      await editUser({
        variables: {
          input: {
            id: userAddress,
            notificationSettings: {
              ...notificationSettings,
              enableEmail: enable,
            },
          },
        },
      });

      updateUser?.(user?.walletAddress, true);
    } catch (err) {
      console.error(err);
    }
  };

  const subscribeToColony = async (
    notifyingColonyId: string,
    enable: boolean,
  ) => {
    if (!userAddress) {
      return;
    }

    try {
      const success = await subscribeToColonyPushNotifications({
        variables: {
          input: {
            userId: userAddress,
            colonyId: notifyingColonyId,
            enable,
          },
        },
      });

      if (success) {
        const title = enable ? 'Subscription' : 'Unsubscription';
        const description = enable
          ? `Subscribed to colony ${notifyingColonyId}`
          : `UnSubscribed from colony ${notifyingColonyId}`;

        toast.success(
          <Toast type="success" title={title} description={description} />,
        );
      } else {
        // Handle failed subscription
        const title = enable ? 'Failed to subscribe' : 'Failed to unsubscribe';
        const description = enable
          ? `Failed to subscribe to colony ${notifyingColonyId}`
          : `Failed to unsubscribe to colony ${notifyingColonyId}`;

        toast.error(
          <Toast type="error" title={title} description={description} />,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    notifications,
    loadingNotifications,
    filterNotificationsByColony,
    pushNotificationsEnabledForDevice,
    enablePushNotifications,
    emailEnabledForUser,
    enableEmailNotifications,
    subscribeToColony,
  };
};
