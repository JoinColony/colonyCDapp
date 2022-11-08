const { default: fetch, Request } = require('node-fetch');

const TokenType = {
  COLONY: 'COLONY',
  ERC20: 'ERC20',
};

const graphqlRequest = async (queryOrMutation, variables, url, authKey) => {
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

  const request = new Request(url, options);

  let body;
  let response;

  try {
    response = await fetch(request);
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

const getTokenType = async (client) => {
  // Colony tokens have the `locked()` method. We assume that when it exists on
  // the contract we have a ColonyToken 🦆. This might not be true though, so can't rely
  // on this 100% when trying to call contract methods
  try {
    await client.locked();
    return TokenType.COLONY;
  } catch {
    return TokenType.ERC20;
  }
};

module.exports = {
  graphqlRequest,
  getTokenType,
};
