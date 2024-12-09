import { backOff } from 'exponential-backoff';

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

interface FetchOptions {
  maxAttempts?: number;
  timeout?: number;
  initialDelay?: number;
  maxDelay?: number;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit & FetchOptions = {},
) {
  const {
    maxAttempts = 2,
    timeout = 15000,
    initialDelay = 1000,
    maxDelay = 5000,
    ...fetchOptions
  } = options;

  return backOff(
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
    {
      numOfAttempts: maxAttempts,
      startingDelay: initialDelay,
      maxDelay,
      timeMultiple: 2,
    },
  );
}

async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> {
  return fetchWithRetry(GRAPHQL_URI, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
}

export async function generateCreateColonyUrl() {
  const CREATE_PRIVATE_BETA_INVITE_CODE = `
      mutation CreatePrivateBetaInviteCode($input: CreatePrivateBetaInviteCodeInput!) {
        createPrivateBetaInviteCode(input: $input) {
          id
        }
      }
    `;

  const response = await graphqlRequest(CREATE_PRIVATE_BETA_INVITE_CODE, {
    input: { shareableInvites: 99 },
  });

  return `/create-colony/${response.data.createPrivateBetaInviteCode.id}`;
}

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

  const response = await graphqlRequest(LIST_COLONY_TOKENS_QUERY);
  return response.data.listTokens.items[0].id;
}

export async function getColonyAddressByName(name = 'planex') {
  const QUERY = `
    query GetColonyByName {
       getColonyByName(name: "${name}", limit: 1) {
        items {
          id
        }
      }
    }
  `;

  const response = await graphqlRequest(QUERY);
  return response.data.getColonyByName.items[0].id;
}

export async function getFirstDomainAndTotalFunds(params: {
  colonyName: string;
}) {
  const QUERY = `
    query GetColonyByName {
      getColonyByName(name: "${params.colonyName}") {
        items {
          balances {
            items {
              balance
              domain {
                metadata {
                  name
            }
          }
          token {
            decimals
            symbol
          }
        }
      }
    }
  }
}
  `;

  const response = await graphqlRequest(QUERY);
  const firstNonZeroBalance =
    response.data.getColonyByName.items[0].balances.items.find(
      (balance) =>
        balance.balance !== '0' && balance.domain.metadata.name !== 'General',
    );

  return {
    balance: firstNonZeroBalance.balance,
    domainName: firstNonZeroBalance.domain.metadata.name,
    tokenSymbol: firstNonZeroBalance.token.symbol,
    tokenDecimals: firstNonZeroBalance.token.decimals,
  };
}
