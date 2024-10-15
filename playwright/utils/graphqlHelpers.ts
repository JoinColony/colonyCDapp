import { request } from '@playwright/test';

export async function generateCreateColonyUrl() {
  const API_KEY = 'da2-fakeApiId123456';
  const GRAPHQL_URI =
    process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

  const CREATE_PRIVATE_BETA_INVITE_CODE = `
      mutation CreatePrivateBetaInviteCode($input: CreatePrivateBetaInviteCodeInput!) {
        createPrivateBetaInviteCode(input: $input) {
          id
        }
      }
    `;

  const requestContext = await request.newContext({
    baseURL: GRAPHQL_URI,
    extraHTTPHeaders: {
      'x-api-key': API_KEY,
    },
  });

  const response = await requestContext.post(GRAPHQL_URI, {
    data: {
      query: CREATE_PRIVATE_BETA_INVITE_CODE,
      variables: {
        input: { shareableInvites: 99 },
      },
    },
  });

  const responseBody = await response.json();
  const inviteCodeId = responseBody.data.createPrivateBetaInviteCode.id;

  return `/create-colony/${inviteCodeId}`;
}
