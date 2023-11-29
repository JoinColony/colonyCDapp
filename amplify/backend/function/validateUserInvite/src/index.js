const { graphqlRequest, getColonyContributorId } = require('./utils');
const {
  getColonyMemberInvite,
  updateColony,
  updateColonyMemberInvite,
  createColonyContributor,
  getUser,
  getColonyContributor,
} = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
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

  const getColonyMemberInviteDetails = await graphqlRequest(
    getColonyMemberInvite,
    { id: colonyAddress },
    graphqlURL,
    apiKey,
  );

  if (
    getColonyMemberInviteDetails.errors ||
    !getColonyMemberInviteDetails.data
  ) {
    const [error] = getColonyMemberInviteDetails.errors;
    throw new Error(error?.message || 'Could not create private beta invite');
  }

  const { id, invitesRemaining, valid } =
    getColonyMemberInviteDetails?.data?.getColonyByAddress?.items[0]
      .colonyMemberInvite;

  const inviteCodeMatches = inviteCode === id;
  const invitesStillExist = invitesRemaining > 0;

  if (!(inviteCodeMatches && invitesStillExist && valid)) {
    throw new Error('Invite code is not valid');
  }

  const { whitelist } =
    getColonyMemberInviteDetails?.data?.getColonyByAddress?.items[0];
  const updatedWhitelist = new Set([...whitelist, userAddress]);

  const colonyMutation = await graphqlRequest(
    updateColony,
    {
      input: {
        id: colonyAddress,
        whitelist: [...updatedWhitelist],
      },
    },
    graphqlURL,
    apiKey,
  );

  if (colonyMutation.errors || !colonyMutation.data) {
    const [error] = colonyMutation.errors;
    throw new Error(error?.message || 'Could not update colony whitelist');
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
    { id: `${colonyAddress}_${userAddress}` },
    graphqlURL,
    apiKey,
  );

  if (contributorExistenceCheckQuery?.data) {
    throw new Error('Colony contributor already exists!');
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
