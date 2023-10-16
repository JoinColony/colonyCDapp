import fetch, { Request } from 'node-fetch';
import { DocumentNode } from 'graphql';

let devApiKey = 'da2-fakeApiId123456';
let devGraphqlURL = 'http://localhost:20002/graphql';

export interface QueryOrMutation<TData = Record<string, unknown>> {
  errors: Array<string>;
  data: TData;
}

export const graphqlRequest = async <
  TData = Record<string, unknown>,
  TVariables = Record<string, unknown>,
>(
  queryOrMutation: string | DocumentNode,
  variables: TVariables,
  url: string = devGraphqlURL,
  apiKey: string = devApiKey,
): Promise<QueryOrMutation<TData>> => {
  const query =
    typeof queryOrMutation === 'string'
      ? queryOrMutation
      : queryOrMutation.loc?.source.body;

  if (!query) {
    throw new Error(
      "Couldn't extract GraphQL query from the provided DocumentNode.",
    );
  }

  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const request = new Request(url, options);

  try {
    const response = await fetch(request);
    const body = await response.json();
    return body as QueryOrMutation<TData>;
  } catch (error) {
    throw error;
  }
};

export { notNull } from '../../../src/utils/arrays';
