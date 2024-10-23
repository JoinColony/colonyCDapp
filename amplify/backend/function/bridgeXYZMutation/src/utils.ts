import fetch from 'cross-fetch';

interface GraphQLResponse {
  data?: any;
  errors?: any[];
}

// @TODO: Lambda utils refactor candidate
export const graphqlRequest = async (
  queryOrMutation: string,
  variables: Record<string, any>,
  url: string,
  authKey: string,
): Promise<GraphQLResponse | null> => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  let response: Response;
  let body: GraphQLResponse;

  try {
    response = await fetch(url, options);
    body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return null;
  }
};
