const fetch = require('cross-fetch');

const { graphqlRequest } = require('./utils');

const { createNotificationsData } = require('./graphql');

const MAGICBELL_USERS_URL = 'https://api.magicbell.com/users';

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let magicbellApiKey = process.env.MAGICBELL_API_KEY;
let magicbellApiSecret = process.env.MAGICBELL_API_SECRET;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, magicbellApiKey, magicbellApiSecret] = await getParams(
      ['appsyncApiKey', 'graphqlUrl', 'magicbellApiKey', 'magicbellApiSecret'],
    );
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { id: walletAddress } = event.arguments?.input || {};

  // Try to create the Magicbell user via their API.
  // If the user already exists for whatever reason, this will still
  // work, and will not overwrite their data.
  try {
    const response = await fetch(MAGICBELL_USERS_URL, {
      method: 'POST',
      headers: {
        'X-MAGICBELL-API-KEY': magicbellApiKey,
        'X-MAGICBELL-API-SECRET': magicbellApiSecret,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        user: {
          external_id: walletAddress,
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error();
    }
  } catch (error) {
    throw new Error(
      `Could not create Magicbell user with wallet address "${walletAddress}"`,
    );
  }

  // Try to create the notifications data for the user in our db via graphql.
  const mutation = await graphqlRequest(
    createNotificationsData,
    {
      input: {
        magicbellUserId: walletAddress,
        userAddress: walletAddress,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (mutation.errors || !mutation.data) {
    const [error] = mutation.errors;
    throw new Error(
      error?.message ||
        `Could not create notifications data for user with wallet address "${walletAddress}"`,
    );
  }

  return {
    userAddress: walletAddress,
  };
};
