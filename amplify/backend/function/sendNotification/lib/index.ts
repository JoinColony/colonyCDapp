// Unfortunatey we cannot destructure this library
// https://github.com/firebase/firebase-admin-node/issues/593
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
import { pushToColony, pushToUser } from './sendPushNotifications';

// Config variables
let apiKey: string;
let graphqlURL: string;

export const handler: Handler<TriggerEvent> = async (event: TriggerEvent) => {
  try {
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  } catch (e) {
    throw new Error(`Unable to get environment variables. Reason: ${e}`);
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

  const colonyQuery = await graphqlRequest<
    GetColonyName_SnQuery,
    GetColonyName_SnQueryVariables
  >(GetColonyName_SnDocument, { id: colonyId || '' }, graphqlURL, apiKey);

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(error || 'Could not fetch colony data from DynamoDB');
  }

  const { name, metadata } = colonyQuery?.data?.getColony || {};

  // Construct the message parts from the above colony queries
  const title =
    customNotificationTitle || metadata?.displayName || name || colonyId;

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
  >(GetUserDetails_SnDocument, { id: userId }, graphqlURL, apiKey);

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

    const tokens = notificationTokens.filter(notNull);

    await pushToUser({ title, body, tokens });
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
  if (!colonyId) {
    throw new Error('No colonyId found for colony broadcast');
  }

  await Promise.all([
    pushToColony({ title, body, colonyId }),
    sendColonyEmail({ colonyId, title }),
  ]);
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
        userId: userId,
        read: false,
        text: body,
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
