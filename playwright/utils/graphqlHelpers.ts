import { request } from '@playwright/test';

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

export async function generateCreateColonyUrl() {
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
// The query is used to fetch a list of pre-seeded verified tokens from the db, and extract the first token address that can be used in the tests
export async function fetchFirstValidTokenAddress() {
  const LIST_COLONY_TOKENS_QUERY = `
    query ListColonyTokens {
      listTokens(filter: {validated: {eq: true}, symbol: {eq: "DAI-L"}}) {
        items {
          id
        }
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
      query: LIST_COLONY_TOKENS_QUERY,
    },
  });

  const responseBody = await response.json();

  const tokenAddress = responseBody.data.listTokens.items[0].id;

  return tokenAddress;
}

export async function getColonyAddressByName(name: string = 'planex') {
  const QUERY = `
    query GetColonyByName {
       getColonyByName(name: "${name}", limit: 1) {
        items {
          id
        }
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
      query: QUERY,
    },
  });

  const responseBody = await response.json();

  return responseBody.data.getColonyByName.items[0].id;
}
