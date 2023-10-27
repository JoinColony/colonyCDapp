import * as admin from 'firebase-admin';
import { Handler } from 'aws-lambda';

import { graphqlRequest, notNull } from '../../utils';
import { getParams } from '../../getParams';

import {
  TriggerEvent,
  GetProfile_StcpnQuery,
  GetProfile_StcpnQueryVariables,
  GetProfile_StcpnDocument,
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
  UpdateColonyContributorDocument,
} from './types';

let apiKey: string;
let graphqlURL: string;
let firebaseAdminConfig: string;

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

  const { userId, colonyId, enable } = event.arguments?.input || {};

  const profileQuery = await graphqlRequest<
    GetProfile_StcpnQuery,
    GetProfile_StcpnQueryVariables
  >(GetProfile_StcpnDocument, { id: userId }, graphqlURL, apiKey);

  if (profileQuery.errors || !profileQuery.data) {
    const [error] = profileQuery.errors;
    throw new Error(error || 'Could not fetch user profile data from DynamoDB');
  }

  const { notificationSettings } = profileQuery?.data?.getProfile || {};

  const pushNotificationsEnabled =
    notificationSettings?.notificationTokens &&
    notificationSettings.notificationTokens.length > 0;

  if (!pushNotificationsEnabled) {
    return false;
  }

  const success = await handleNotificationSubscriptions(
    enable,
    colonyId,
    userId,
    notificationSettings?.notificationTokens?.filter(notNull) || [],
  );

  return success;
};

const handleNotificationSubscriptions = async (
  enable: boolean,
  colonyId: string,
  userId: string,
  notificationTokens: Array<string>,
) => {
  const serviceAccount = JSON.parse(firebaseAdminConfig);

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const messaging = app.messaging();

  try {
    const response = enable
      ? await messaging.subscribeToTopic(notificationTokens, colonyId)
      : await messaging.unsubscribeFromTopic(notificationTokens, colonyId);

    console.log(
      `Successfully ${enable ? 'subscribed to' : 'unsubscribed from'} topic:`,
      response,
    );
  } catch (error) {
    console.log(
      `Error ${enable ? 'subscribing to' : 'unsubscribing from'} topic:`,
      error,
    );
    return false;
  }

  try {
    await updateContributorPushSetting(colonyId, userId, enable);
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};

async function updateContributorPushSetting(
  colonyId: string,
  userId: string,
  enable: boolean,
) {
  const mutation = await graphqlRequest<
    UpdateColonyContributorMutation,
    UpdateColonyContributorMutationVariables
  >(
    UpdateColonyContributorDocument,
    {
      input: {
        id: `${colonyId}_${userId}`,
        notificationSettings: {
          enablePush: enable,
        },
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
