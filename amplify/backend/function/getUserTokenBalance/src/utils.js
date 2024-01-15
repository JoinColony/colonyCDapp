const fetch = require('cross-fetch');
const { getColonyStake } = require('./graphql');

const graphqlRequest = async (
  queryOrMutation,
  variables,
  apiKey,
  graphqlURL,
) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  let body;
  let response;

  try {
    response = await fetch(graphqlURL, options);
    body = await response.json();
    return body;
  } catch (error) {
    /*
     * Something went wrong... obviously
     */
    console.error(error);
    return null;
  }
};

const getColonyStakeId = (walletAddress, colonyAddress) => {
  return `${walletAddress}_${colonyAddress}`;
};

const getStakedTokens = async (
  walletAddress,
  colonyAddress,
  apiKey,
  graphqlURL,
) => {
  const { data } =
    (await graphqlRequest(
      getColonyStake,
      {
        colonyStakeId: getColonyStakeId(walletAddress, colonyAddress),
      },
      apiKey,
      graphqlURL,
    )) ?? {};

  return data?.getColonyStake?.totalAmount ?? 0;
};

module.exports = {
  graphqlRequest,
  getStakedTokens,
};
