const { graphqlRequest } = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const {
  getInviteCodeValidity,
  updateInviteCodeValidity,
  updateUser,
  createColonyMetadata,
} = require('./graphql');

const isDev = process.env.ENV === 'dev';

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

  const {
    colonyName,
    colonyDisplayName,
    colonyAvatar,
    colonyThumbnail,
    tokenAvatar,
    tokenThumbnail,
    initiatorAddress,
    transactionHash,
    inviteCode,
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
          userId: inviteCodeUserId || initiatorAddress,
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
            id: initiatorAddress,
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
   * Create the colony's temporary metadata
   */
  const colonyMetadataMutation = await graphqlRequest(
    createColonyMetadata,
    {
      input: {
        id: `etherealcolonymetadata-${transactionHash}`,
        displayName: colonyDisplayName,
        etherealData: {
          colonyName: colonyName.toLowerCase(),
          colonyDisplayName,
          colonyAvatar,
          colonyThumbnail,
          tokenAvatar,
          tokenThumbnail,
          initiatorAddress,
        },
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMetadataMutation.errors || !colonyMetadataMutation.data) {
    const [error] = colonyMetadataMutation.errors;
    throw new Error(
      error?.message ||
        `Could not create colony "${name}" with address "${checksummedAddress} 's metadata from transaction ${transactionHash}"`,
    );
  }

  return colonyMetadataMutation?.data?.createColonyMetadata || null;
};
