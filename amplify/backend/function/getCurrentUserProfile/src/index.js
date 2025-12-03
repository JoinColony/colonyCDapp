const fetch = require('cross-fetch');
const { utils } = require('ethers');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

const graphqlRequest = async (queryOrMutation, variables, url, authKey) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  try {
    const response = await fetch(url, options);
    const body = await response.json();
    return body;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    return null;
  }
};

// Query to get the full user data including private fields
const getUserQuery = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      profileId
      bridgeCustomerId
      profile {
        id
        avatar
        bio
        displayName
        displayNameChanged
        email
        location
        thumbnail
        website
        preferredCurrency
        isAutoOfframpEnabled
        meta {
          metatransactionsEnabled
          decentralizedModeEnabled
          customRpc
        }
      }
      privateBetaInviteCode {
        id
        shareableInvites
      }
      notificationsData {
        magicbellUserId
        notificationsDisabled
        mutedColonyAddresses
        paymentNotificationsDisabled
        mentionNotificationsDisabled
        adminNotificationsDisabled
      }
    }
  }
`;

/**
 * Lambda handler for getting the current authenticated user's private profile data.
 * This function enforces that users can only access their own private data.
 * 
 * @param {object} event - The Lambda event containing request headers and arguments
 * @returns {object|null} - The user's private profile data if authenticated, null otherwise
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  // Get the authenticated wallet address from the request headers
  // This is set by the auth proxy after validating the user's session
  const authenticatedWalletAddress = event.request?.headers?.['x-wallet-address'];

  if (!authenticatedWalletAddress) {
    console.log('No authenticated wallet address found in request headers');
    return null;
  }

  let checksummedWalletAddress;
  try {
    checksummedWalletAddress = utils.getAddress(authenticatedWalletAddress);
  } catch (error) {
    console.error('Invalid wallet address format:', error);
    return null;
  }

  // Fetch the user's private data from the database
  const result = await graphqlRequest(
    getUserQuery,
    { id: checksummedWalletAddress },
    graphqlURL,
    apiKey,
  );

  if (result?.errors || !result?.data) {
    console.error('Failed to fetch user data:', result?.errors);
    return null;
  }

  const user = result?.data?.getUser;

  if (!user) {
    console.log('User not found for address:', checksummedWalletAddress);
    return null;
  }

  // Return the user data with walletAddress alias for consistency
  return {
    ...user,
    walletAddress: user.id,
  };
};
