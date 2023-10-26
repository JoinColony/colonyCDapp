const { graphqlRequest, getColonyContributorId } = require('./utils');
const {
  getColonyMemberInvite,
  updateColony,
  createColonyContributor,
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
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { colonyAddress, inviteCode, userAddress } =
    event.arguments?.input || {};

  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
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

  const { code, invitesRemaining, valid } =
    getColonyMemberInviteDetails?.data?.getColonyByAddress?.items[0]
      .colonyMemberInvite;

  const inviteCodeMatches = inviteCode === code;
  const invitesStillExist = invitesRemaining > 0;

  if (!(inviteCodeMatches && invitesStillExist && valid)) {
    return false;
  }

  if (userAddress) {
    const { whitelist } =
      getColonyMemberInviteDetails?.data?.getColonyByAddress?.items[0];
    const updatedWhitelist = new Set([...whitelist, userAddress]);
    console.log({ whitelist, updatedWhitelist, userAddress });

    const colonyMutation = await graphqlRequest(
      updateColony,
      {
        input: {
          id: colonyAddress,
          whitelist: [...updatedWhitelist],
          colonyMemberInvite: {
            code,
            invitesRemaining: invitesRemaining - 1,
            valid,
          },
        },
      },
      graphqlURL,
      apiKey,
    );

    if (colonyMutation.errors || !colonyMutation.data) {
      const [error] = colonyMutation.errors;
      throw new Error(error?.message || 'Could not create private beta invite');
    }

    const colonyContributorMutation = await graphqlRequest(
      createColonyContributor,
      {
        input: {
          colonyAddress,
          colonyReputationPercentage: 0,
          contributorAddress: userAddress,
          isVerified: false,
          id: getColonyContributorId(colonyAddress, userAddress),
          isWatching: true,
        },
      },
      graphqlURL,
      apiKey,
    );

    if (colonyContributorMutation.errors || !colonyContributorMutation.data) {
      const [error] = colonyContributorMutation.errors;
      throw new Error(error?.message || 'Could not create private beta invite');
    }
  }

  return true;
};
