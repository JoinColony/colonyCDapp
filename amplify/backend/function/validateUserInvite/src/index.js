const { graphqlRequest, getColonyContributorId } = require('./utils');
const {
  getColonyMemberInvite,
  updateColony,
  updateColonyMemberInvite,
  createColonyContributor,
  getUser,
  getColonyContributor,
  updateColonyContributor,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qaarbsep' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { colonyAddress, inviteCode, userAddress } =
    event.arguments?.input || {};

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const userExistenceCheckQuery = await graphqlRequest(
    getUser,
    { id: userAddress },
    graphqlURL,
    apiKey,
  );

  if (userExistenceCheckQuery.errors || !userExistenceCheckQuery.data) {
    const [error] = userExistenceCheckQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch user data from DynamoDB',
    );
  }

  const getColonyMemberInviteResponse = await graphqlRequest(
    getColonyMemberInvite,
    { inviteCode },
    graphqlURL,
    apiKey,
  );

  if (
    getColonyMemberInviteResponse.errors ||
    !getColonyMemberInviteResponse.data
  ) {
    const [error] = getColonyMemberInviteResponse.errors;
    throw new Error(error?.message || 'Could not create private beta invite');
  }

  const { colonyId: inviteColonyAddress, invitesRemaining } =
    getColonyMemberInviteResponse?.data?.getColonyMemberInvite;

  const colonyAddressMatches = inviteColonyAddress === colonyAddress;
  const hasInvitesRemaining = invitesRemaining > 0;

  if (!(colonyAddressMatches && hasInvitesRemaining)) {
    throw new Error('Invite code is not valid');
  }

  const colonyMemberInviteMutation = await graphqlRequest(
    updateColonyMemberInvite,
    {
      input: {
        id: inviteCode,
        invitesRemaining: invitesRemaining - 1,
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMemberInviteMutation.errors || !colonyMemberInviteMutation.data) {
    const [error] = colonyMemberInviteMutation.errors;
    throw new Error(error?.message || 'Could not update private beta invite');
  }

  const contributorExistenceCheckQuery = await graphqlRequest(
    getColonyContributor,
    { id: getColonyContributorId(colonyAddress, userAddress) },
    graphqlURL,
    apiKey,
  );

  if (contributorExistenceCheckQuery?.data?.getColonyContributor) {
    // If the user has already been a contributor for a Colony before,
    // switching their isWatching field to true will allow them to access it again
    const colonyMemberIsWatchingMutation = await graphqlRequest(
      updateColonyContributor,
      {
        input: {
          id: getColonyContributorId(colonyAddress, userAddress),
          isWatching: true,
        },
      },
      graphqlURL,
      apiKey,
    );

    if (
      colonyMemberIsWatchingMutation.errors ||
      !colonyMemberIsWatchingMutation.data
    ) {
      const [error] = colonyMemberIsWatchingMutation.errors;

      throw new Error(
        error?.message || 'Could not set contributor isWatching field to true',
      );
    }

    return true;
  }

  const colonyContributorMutation = await graphqlRequest(
    createColonyContributor,
    {
      input: {
        colonyAddress,
        colonyReputationPercentage: 0,
        contributorAddress: userAddress,
        isVerified: false,
        isWatching: true,
        hasReputation: false,
        id: getColonyContributorId(colonyAddress, userAddress),
        type: 'NEW',
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyContributorMutation.errors || !colonyContributorMutation.data) {
    const [error] = colonyContributorMutation.errors;
    throw new Error(error?.message || 'Could not create private beta invite');
  }

  return true;
};
