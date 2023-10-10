import React, { useEffect, useState } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  getToken,
  Messaging,
} from 'firebase/messaging';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { ContextModule, getContext } from '~context';
import {
  GetUserNotificationTokensDocument,
  GetUserNotificationTokensQuery,
  GetUserNotificationTokensQueryVariables,
  useUpdateUserNotificationTokenMutation,
  useSubscribeToColonyPushNotificationsMutation,
  useGetUserNotificationsQuery,
} from '~gql';
import Toast from '~shared/Extensions/Toast';
import { notNull } from '~utils/arrays';

const vapidKey = process.env.VAPID_KEY;

const firebaseConfig = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : {};

export const useNotifications = (
  walletAddress: string | undefined,
  colonyId?: string,
) => {
  const { formatMessage } = useIntl();
  const apolloClient = getContext(ContextModule.ApolloClient);
  const [updateNotificationTokens] = useUpdateUserNotificationTokenMutation();
  const [subscribeToColonyPushNotifications] =
    useSubscribeToColonyPushNotificationsMutation();

  const [cachedMessaging, setCachedMessaging] = useState<Messaging>();

  const {
    data,
    loading: loadingNotifications,
    refetch,
  } = useGetUserNotificationsQuery({
    variables: {
      id: walletAddress ?? '',
      colonyId,
    },
    skip: !walletAddress,
  });

  const notifications = data?.notificationsByDate?.items.filter(notNull) ?? [];

  const fetchNotificationTokens = async (userId: string) => {
    const { data: tokensData } = await apolloClient.query<
      GetUserNotificationTokensQuery,
      GetUserNotificationTokensQueryVariables
    >({
      query: GetUserNotificationTokensDocument,
      variables: {
        id: userId,
      },
    });
    return (
      tokensData.getProfile?.notificationSettings?.notificationTokens || []
    );
  };

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
    refetch({ id: walletAddress, colonyId: filterByColony });
  };

  const registerDeviceForNotifications = async (userId: string) => {
    try {
      if (!cachedMessaging) {
        return;
      }

      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      const currentToken = await getToken(cachedMessaging, { vapidKey });

      if (currentToken) {
        const notificationTokens = await fetchNotificationTokens(userId);

        if (notificationTokens.includes(currentToken)) {
          return;
        }

        await updateNotificationTokens({
          variables: {
            id: userId,
            notificationTokens: [...notificationTokens, currentToken],
          },
        });

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

  const subscribeToColony = async (
    userId: string,
    notifyingColonyId: string,
    enable: boolean,
  ) => {
    try {
      const success = await subscribeToColonyPushNotifications({
        variables: {
          input: {
            userId,
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
    registerDeviceForNotifications,
    subscribeToColony,
  };
};
