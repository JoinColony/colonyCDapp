const admin = require('firebase-admin');

const { graphqlRequest } = require('./utils');
const {
  getProfile,
  updateContributorNotificationSettings,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let firebaseAdminConfig;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, firebaseAdminConfig] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'firebaseAdminConfig',
    ]);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { userId } = event.arguments?.input || {};

  // This registration token comes from the client FCM SDKs.
  const profileQuery = await graphqlRequest(
    getProfile,
    { id: userId },
    graphqlURL,
    apiKey,
  );

  if (profileQuery.errors || !profileQuery.data) {
    const [error] = profileQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch user profile data from DynamoDB',
    );
  }

  let params = {
    ...(event.arguments?.input || {}),
    ...(profileQuery?.data?.getProfile || {}),
  };

  const { notificationSettings } = params;

  const pushNotificationsEnabled =
    notificationSettings?.notificationTokens &&
    notificationSettings.notificationTokens.length > 0;

  if (!pushNotificationsEnabled) {
    return false;
  }

  const success = await handleNotificationSubscriptions(params);

  return success;
};

const handleNotificationSubscriptions = async (params) => {
  const { enable, colonyId, userId, notificationSettings } = params;

  const serviceAccount = JSON.parse(firebaseAdminConfig);

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const messaging = app.messaging();
  const notificationTokens = notificationSettings?.notificationTokens;

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

async function updateContributorPushSetting(colonyId, userId, enable) {
  const mutation = await graphqlRequest(
    updateContributorNotificationSettings,
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
      error?.message ||
        `Could not update colony watcher ${userId}'s push notification settings`,
    );
  }
}
