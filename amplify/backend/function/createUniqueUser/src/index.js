const { utils } = require('ethers');

const isDev = process.env.ENV === 'dev';

// const basicTokenAbi = require('./basicTokenAbi.json');
const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser, createUser, createProfile } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  if (!isDev) {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { id: walletAddress, profile } = event.arguments?.input || {};

  let checksummedWalletAddress;
  try {
    checksummedWalletAddress = utils.getAddress(walletAddress);
  } catch (error) {
    throw new Error("User's wallet address is not valid (after checksum)");
  }

  const query = await graphqlRequest(
    getUser,
    { id: checksummedWalletAddress, name: profile.displayName },
    graphqlURL,
    apiKey,
  );

  if (query.errors || !query.data) {
    const [error] = query.errors;
    throw new Error(
      error?.message || 'Could not fetch user data from DynamoDB',
    );
  }

  const { id: existingUserWallet } = query?.data?.getProfile ?? {};
  const [existingUserName] = query?.data?.getProfileByUsername?.items || {};

  if (existingUserWallet) {
    throw new Error(
      `User with wallet address "${existingUserWallet}" is already registered`,
    );
  }

  if (existingUserName) {
    throw new Error(
      `User with name "${existingUserName.name}" is already registered`,
    );
  }

  /*
   * Create user profile
   */
  await graphqlRequest(
    createProfile,
    {
      input: {
        ...profile,
        id: checksummedWalletAddress,
        displayNameChanged: new Date().toISOString(),
        meta: {
          metatransactionsEnabled: !isDev,
        },
      },
    },
    graphqlURL,
    apiKey,
  );

  /*
   * Create user
   */
  const mutation = await graphqlRequest(
    createUser,
    {
      input: {
        id: checksummedWalletAddress,
        profileId: checksummedWalletAddress,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (mutation.errors || !mutation.data) {
    const [error] = mutation.errors;
    throw new Error(
      error?.message ||
        `Could not create user "${profile.displayName}" with wallet address "${checksummedWalletAddress}"`,
    );
  }

  return mutation?.data?.createUser || null;
};
