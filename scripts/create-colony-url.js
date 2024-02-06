/*
 * @NOTE Copied from the temp-create-data.js script
 * This script spits out a link to create a colony using a newly created private invite code
 */
const {
  graphqlRequest,
} = require('../amplify/backend/function/createUniqueColony/src/utils');

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

const createPrivateBetaInviteCode = /* GraphQL */ `
  mutation CreatePrivateBetaInviteCode(
    $input: CreatePrivateBetaInviteCodeInput!
  ) {
    createPrivateBetaInviteCode(input: $input) {
      id
    }
  }
`;

const generateCreateColonyUrl = async () => {
  const inviteMutation = await graphqlRequest(
    createPrivateBetaInviteCode,
    {
      input: { shareableInvites: 2 },
    },
    GRAPHQL_URI,
    API_KEY,
  );

  console.log(
    `http://${process.env.HOST}/${inviteMutation.data.createPrivateBetaInviteCode.id}`,
  );
};

generateCreateColonyUrl();
