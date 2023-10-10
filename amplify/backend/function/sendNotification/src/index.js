const admin = require('firebase-admin');

const { graphqlRequest, NotificationType } = require('./utils');
const { getUser, getColonyName, createUserNotification } = require('./graphql');
const { notificationBuilder } = require('./messages');
const { sendEmail } = require('./email');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let firebaseAdminConfig;
let mailJetApiKey;
let mailJetApiSecret;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, firebaseAdminConfig, mailJetApiKey, mailJetApiSecret] =
      await getParams([
        'appsyncApiKey',
        'graphqlUrl',
        'firebaseAdminConfig',
        'mailJetApiKey',
        'mailJetApiSecret',
      ]);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context, callback) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  let params = {
    ...(event.arguments?.input || {}),
    graphqlURL,
    apiKey,
    mailJetApiKey,
    mailJetApiSecret,
  };

  const { userId, colonyId } = params;

  const serviceAccount = JSON.parse(firebaseAdminConfig);

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const messaging = app.messaging();

  const colonyQuery = await graphqlRequest(
    getColonyName,
    { id: colonyId },
    graphqlURL,
    apiKey,
  );

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const { name, metadata } = colonyQuery?.data?.getColony || {};

  const colonyName = metadata?.displayName || name || colonyId;

  params = { ...params, messaging, colonyName };

  // NOTE: We are sending data web push messages and handling them
  // ourselves in the firebase web worker
  const data = await notificationBuilder(params);

  params = { ...params, data };

  if (userId) {
    await sendMessageToUser(params);
    await createNotificationInDatabase(params);
  } else {
    await broadcastToColony(params);
  }
};

async function sendMessageToUser(params) {
  const { messaging, userId, type, data } = params;

  const userQuery = await graphqlRequest(
    getUser,
    { id: userId },
    graphqlURL,
    apiKey,
  );

  if (userQuery.errors || !userQuery.data) {
    const [error] = userQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch user data from DynamoDB',
    );
  }

  const {
    notificationPreferences,
    email: userEmail,
    displayName: userName,
    notificationSettings,
  } = userQuery?.data?.getProfile || {};

  const notificationTokens = notificationSettings?.notificationTokens || [];

  // This is also how we check for this boolean in the UI
  const pushNotificationsEnabled = notificationTokens.length > 0;

  if (pushNotificationsEnabled) {
    params = { ...params, userEmail, userName };

    // Test for user preferences here
    // This will undoubtedly expand as we flesh out this feature
    if (
      type === NotificationType.Mention &&
      !Boolean(notificationPreferences?.enableMentions)
    ) {
      console.warn('User has disabled mentions, aborting notification');
      return;
    }

    const message = {
      data,
      tokens: notificationTokens,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    try {
      const response = await messaging.sendEachForMulticast(message);

      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
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

  if (notificationSettings?.enableEmails) {
    await sendEmail(params);
  }
}

async function broadcastToColony(params) {
  const { messaging, colonyId, data } = params;

  const message = {
    data,
    topic: colonyId,
  };

  // Send a message to devices subscribed to the provided topic.
  try {
    const response = await messaging.send(message);
    console.log(`Successfully sent message to topic ${colonyId}:`, response);
  } catch (error) {
    console.log('Error sending message:', error);
  }

  await sendEmail(params);
}

async function createNotificationInDatabase(params) {
  const { colonyId, userId, data } = params;
  const mutation = await graphqlRequest(
    createUserNotification,
    {
      input: {
        colonyId,
        userId,
        read: false,
        text: data.body,
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
