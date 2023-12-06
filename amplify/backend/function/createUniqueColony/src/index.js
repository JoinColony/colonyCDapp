const { utils } = require('ethers');
const crypto = require('crypto');

const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const {
  getColony,
  createColony,
  getTokenByAddress,
  getInviteCodeValidity,
  updateInviteCodeValidity,
  updateUser,
  createColonyMemberInvite,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'sc' || ENV === 'prod') {
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

  const {
    id: colonyAddress,
    name,
    colonyNativeTokenId,
    type = 'COLONY',
    version,
    chainMetadata,
    status,
    inviteCode,
    userId,
  } = event.arguments?.input || {};

  /*
   * Validate invite code
   */
  if (!(inviteCode === 'dev' && process.env.ENV === 'dev')) {
    const inviteCodeQuery = await graphqlRequest(
      getInviteCodeValidity,
      { id: inviteCode },
      graphqlURL,
      apiKey,
    );

    const { shareableInvites, userId: inviteCodeUserId } =
      inviteCodeQuery?.data?.getPrivateBetaInviteCode || {};

    if (shareableInvites === 0) {
      throw new Error(`Invite code is not valid`);
    }

    const inviteCodeMutation = await graphqlRequest(
      updateInviteCodeValidity,
      {
        input: {
          id: inviteCode,
          shareableInvites: shareableInvites - 1,
          userId: inviteCodeUserId || userId,
        },
      },
      graphqlURL,
      apiKey,
    );

    if (inviteCodeMutation.errors || !inviteCodeMutation.data) {
      const [error] = inviteCodeMutation.errors;
      throw new Error(
        error?.message || `Could not update ${inviteCode} validity`,
      );
    }

    if (!inviteCodeUserId) {
      const userMutation = await graphqlRequest(
        updateUser,
        {
          input: {
            id: userId,
            userPrivateBetaInviteCodeId: inviteCode,
          },
        },
        graphqlURL,
        apiKey,
      );

      if (userMutation.errors || !inviteCodeMutation.data) {
        const [error] = userMutation.errors;
        throw new Error(error?.message || `Could not update ${user} validity`);
      }
    }
  }

  /*
   * Validate Colony and Token addresses
   */
  let checksummedAddress;
  let checksummedToken;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch (error) {
    throw new Error(
      `Colony address "${colonyAddress}" is not valid (after checksum)`,
    );
  }
  try {
    checksummedToken = utils.getAddress(colonyNativeTokenId);
  } catch (error) {
    throw new Error(
      `Token address "${colonyNativeTokenId}" is not valid (after checksum)`,
    );
  }

  if (checksummedAddress === checksummedToken) {
    throw new Error(
      `Token address "${checksummedToken}" and Colony address "${checksummedAddress}" cannot be the same`,
    );
  }

  /*
   * Determine if the colony was already registered
   * Either via it's address or via it's name
   */
  const colonyQuery = await graphqlRequest(
    getColony,
    { id: checksummedAddress, name },
    graphqlURL,
    apiKey,
  );

  if (colonyQuery.errors || !colonyQuery.data) {
    const [error] = colonyQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const [existingColonyAddress] =
    colonyQuery?.data?.getColonyByAddress?.items || [];
  const [existingColonyName] = colonyQuery?.data?.getColonyByName?.items || [];

  if (existingColonyAddress) {
    throw new Error(
      `Colony with address "${existingColonyAddress.id}" is already registered`,
    );
  }
  if (existingColonyName) {
    throw new Error(
      `Colony with name "${existingColonyName.name}" is already registered`,
    );
  }

  if (type === 'METACOLONY') {
    const [existingMetacolony] =
      colonyQuery?.data?.getColonyByType?.items || [];
    if (existingMetacolony) {
      throw new Error(
        `Metacolony "${existingMetacolony.name}" already exists. There can be only one metacolony.`,
      );
    }
  }

  /*
   * Determine if the token exists
   */
  const tokenQuery = await graphqlRequest(
    getTokenByAddress,
    { id: checksummedToken },
    graphqlURL,
    apiKey,
  );

  if (tokenQuery.errors || !tokenQuery.data) {
    const [error] = tokenQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch token data from DynamoDB',
    );
  }

  const [existingTokenAddress] =
    tokenQuery?.data?.getTokenByAddress?.items || [];

  if (!existingTokenAddress) {
    throw new Error(
      `Token with address "${checksummedToken}" does not exist, hence it cannot be used as a native token for this colony`,
    );
  }

  const memberInviteCode = crypto.randomUUID();

  /*
   * Create the colony
   */
  const colonyMutation = await graphqlRequest(
    createColony,
    {
      input: {
        id: checksummedAddress,
        nativeTokenId: checksummedToken,
        name,
        type,
        chainMetadata,
        version,
        status,
        colonyMemberInviteCode: memberInviteCode,
        whitelist: [userId],
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMutation.errors || !colonyMutation.data) {
    const [error] = colonyMutation.errors;
    throw new Error(
      error?.message ||
        `Could not create user "${name}" with wallet address "${checksummedAddress}"`,
    );
  }

  /*
   * Create the member invite
   */
  const inviteMutation = await graphqlRequest(
    createColonyMemberInvite,
    {
      input: {
        id: memberInviteCode,
        colonyId: colonyMutation?.data?.createColony?.id,
        invitesRemaining: 100,
        valid: true,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (inviteMutation.errors || !inviteMutation.data) {
    const [error] = inviteMutation.errors;
    throw new Error(error?.message || `Could not create private member invite`);
  }

  return colonyMutation?.data?.createColony || null;
};
