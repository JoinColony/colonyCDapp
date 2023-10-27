// Unfortunatey we cannot destructure this library
// https://github.com/firebase/firebase-admin-node/issues/593
import * as admin from 'firebase-admin';
import { Handler } from 'aws-lambda';

import { graphqlRequest, notNull } from '../../utils';
import { getParams } from '../../getParams';

import {
  TriggerEvent,
  GetColonyName_SnQuery,
  GetColonyName_SnQueryVariables,
  GetColonyName_SnDocument,
  GetUserDetails_SnDocument,
  GetUserDetails_SnQueryVariables,
  GetUserDetails_SnQuery,
  NotificationType,
  CreateNotification_SnMutation,
  CreateNotification_SnMutationVariables,
  CreateNotification_SnDocument,
  SendMessageToUserParams,
  CreateNotificationInDatabaseParams,
  BroadcastToColonyParams,
} from './types';

import { notificationBuilder } from './message';
import { sendUserEmail, sendColonyEmail } from './sendEmailNotifications';

let apiKey: string;
let graphqlURL: string;
let firebaseAdminConfig: string;
let messaging: admin.messaging.Messaging;

const removeInterpolationMarkers = (message: string) => {
  return message.replace(/[\[\]]/g, '');
};

export const handler: Handler<TriggerEvent> = async (event: TriggerEvent) => {
  try {
    [apiKey, graphqlURL, firebaseAdminConfig] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'firebaseAdminConfig',
    ]);
  } catch (e) {
    throw new Error(`Unable to set environment variables. Reason: ${e}`);
  }

  const {
    userId,
    colonyId,
    customNotificationTitle,
    type,
    associatedUserId,
    associatedActionId,
    customNotificationText,
  } = event.arguments?.input;

  const serviceAccount = JSON.parse(firebaseAdminConfig);

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  messaging = app.messaging();

  const colonyQuery = await graphqlRequest<
    GetColonyName_SnQuery,
    GetColonyName_SnQueryVariables
  >(GetColonyName_SnDocument, { id: colonyId || '' }, graphqlURL, apiKey);

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(error || 'Could not fetch colony data from DynamoDB');
  }

  const { name, metadata } = colonyQuery?.data?.getColony || {};

  const title =
    customNotificationTitle || metadata?.displayName || name || colonyId;

  // NOTE: We are sending data web push messages and handling them
  // ourselves in the firebase web worker
  const body = await notificationBuilder({
    type,
    associatedUserId,
    associatedActionId,
    customNotificationText,
  });

  if (userId) {
    await sendMessageToUser({ userId, type, title, body });
    await createNotificationInDatabase({ colonyId, userId, body, title });
  } else {
    await broadcastToColony({ colonyId, title, body });
  }

  return true;
};

async function sendMessageToUser({
  userId,
  type,
  title,
  body,
}: SendMessageToUserParams) {
  const userQuery = await graphqlRequest<
    GetUserDetails_SnQuery,
    GetUserDetails_SnQueryVariables
  >(GetUserDetails_SnDocument, { id: userId ?? '' }, graphqlURL, apiKey);

  if (userQuery.errors || !userQuery.data) {
    const [error] = userQuery.errors;
    throw new Error(error || 'Could not fetch user data from DynamoDB');
  }

  const {
    email: userEmail,
    displayName: userName,
    notificationSettings,
  } = userQuery?.data?.getProfile || {};

  const notificationTokens = notificationSettings?.notificationTokens || [];

  // This is also how we check for this boolean in the UI
  const pushNotificationsEnabled = notificationTokens.length > 0;

  if (pushNotificationsEnabled) {
    // Test for user preferences here
    // This will undoubtedly expand as we flesh out this feature
    if (
      type === NotificationType.Mention &&
      !Boolean(notificationSettings?.enableMention)
    ) {
      console.warn('User has disabled mentions, aborting notification');
      return false;
    }

    const message = {
      data: {
        title: title || '',
        body: removeInterpolationMarkers(body || ''),
      },
      tokens: notificationTokens.filter(notNull),
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    try {
      if (!messaging) {
        return;
      }

      const response = await messaging.sendEachForMulticast(message);

      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            //@ts-ignore
            failedTokens.push(notificationTokens[idx]);
          }
        });
        // Remove these from the db if they fail?
        console.log('List of tokens that caused failures: ' + failedTokens);
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }

  if (notificationSettings?.enableEmail) {
    await sendUserEmail({ userEmail, userName, title, userId });
  }
}

async function broadcastToColony({
  colonyId,
  title,
  body,
}: BroadcastToColonyParams) {
  const message = {
    data: { title: title || '', body: removeInterpolationMarkers(body || '') },
    topic: colonyId || '',
  };

  // Send a message to devices subscribed to the provided topic.
  try {
    const response = await messaging?.send(message);
    console.log(`Successfully sent message to topic ${colonyId}:`, response);
  } catch (error) {
    console.log('Error sending message:', error);
  }

  await sendColonyEmail({ colonyId, title });
}

async function createNotificationInDatabase({
  colonyId,
  userId,
  body,
  title,
}: CreateNotificationInDatabaseParams) {
  const mutation = await graphqlRequest<
    CreateNotification_SnMutation,
    CreateNotification_SnMutationVariables
  >(
    CreateNotification_SnDocument,
    {
      input: {
        colonyId,
        userId: userId || '',
        read: false,
        text: body || '',
        title: title,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (mutation.errors || !mutation.data) {
    const [error] = mutation.errors;
    throw new Error(
      error ||
        `Could not update colony watcher ${userId}'s push notification settings`,
    );
  }
}
