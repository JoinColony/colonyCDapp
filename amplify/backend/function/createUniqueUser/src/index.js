const { utils } = require('ethers');

// const basicTokenAbi = require('./basicTokenAbi.json');
const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser, createUser, createProfile } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

exports.handler = async (event) => {
  const { id: walletAddress, name, profile } = event.arguments?.input || {};

  let checksummedWalletAddress;
  try {
    checksummedWalletAddress = utils.getAddress(walletAddress);
  } catch (error) {
    throw new Error("User's wallet address is not valid (after checksum)");
  }

  const query = await graphqlRequest(
    getUser,
    { id: checksummedWalletAddress, name },
    GRAPHQL_URI,
    API_KEY,
  );

  if (query.errors || !query.data) {
    const [error] = query.errors;
    throw new Error(
      error?.message || 'Could not fetch user data from DynamoDB',
    );
  }

  const [existingUserWallet] = query?.data?.getUserByAddress?.items || {};
  const [existingUserName] = query?.data?.getUserByName?.items || {};

  if (existingUserWallet) {
    throw new Error(
      `User with wallet address "${existingUserWallet.id}" is already registered`,
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
        id: checksummedWalletAddress,
        ...profile,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  /*
   * Create user
   */
  const mutation = await graphqlRequest(
    createUser,
    {
      input: {
        id: checksummedWalletAddress,
        name,
        profileId: checksummedWalletAddress,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  if (mutation.errors || !mutation.data) {
    const [error] = mutation.errors;
    throw new Error(
      error?.message ||
        `Could not create user "${name}" with wallet address "${checksummedWalletAddress}"`,
    );
  }

  return mutation?.data?.createUser || null;
};
