import * as admin from 'firebase-admin';

import { getParams } from '../../getParams';
import { removeInterpolationMarkers } from './message';
import { PushToColonyParams, PushToUserParams } from './types';

const pushSetup = async () => {
  try {
    const [apiKey, graphqlURL, firebaseAdminConfig] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'firebaseAdminConfig',
    ]);

    const serviceAccount = JSON.parse(firebaseAdminConfig);

    // Initialise the firebase application that handles push notifications
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const messaging = app.messaging();

    return {
      apiKey,
      graphqlURL,
      messaging,
    };
  } catch (e) {
    throw new Error(`Unable to get environment variables. Reason: ${e}`);
  }
};

export const pushToUser = async ({ title, body, tokens }: PushToUserParams) => {
  const { messaging } = await pushSetup();

  // NOTE: We are sending *data* web push messages and handling them
  // ourselves in the firebase web worker which is why they have this format
  const message = {
    data: {
      title,
      body: removeInterpolationMarkers(body),
    },
    tokens,
  };

  try {
    if (!messaging) {
      return;
    }

    // Send a message to each device registered to the user
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
};

export const pushToColony = async ({
  title,
  body,
  colonyId,
}: PushToColonyParams) => {
  const { messaging } = await pushSetup();

  // Send a message to devices subscribed to the provided topic which is the colony Id.
  const message = {
    data: {
      title,
      body: removeInterpolationMarkers(body),
    },
    topic: colonyId,
  };

  try {
    const response = await messaging?.send(message);
    console.log(`Successfully sent message to topic ${colonyId}:`, response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};
