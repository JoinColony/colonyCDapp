const { default: fetch, Request } = require('node-fetch');

const TokenType = {
  COLONY: 'COLONY',
  ERC20: 'ERC20',
};

// These are a subsection of the constants in the main project
// that should be imported when this is enabled via a different
// lambda build system
const ETHEREUM_NETWORK = {
  shortName: 'Mainnet',
};
const BINANCE_NETWORK = {
  shortName: 'BNB',
};
const GANACHE_NETWORK = {
  shortName: 'Ganache',
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

const getRpcUrlParamName = (network) => {
  let chainRpcParam = 'chainRpcEndpoint';

  switch (network) {
    case BINANCE_NETWORK.shortName:
      chainRpcParam = 'bnbRpcEndpoint';
      break;
    case ETHEREUM_NETWORK.shortName:
    default:
    // Use default chainRpcParam ie Ethereum to set `rpcURL`
  }

  return chainRpcParam;
};

const getDevRpcUrl = (network) => {
  switch (network) {
    case BINANCE_NETWORK.shortName:
      return 'https://bsc.meowrpc.com';
    case ETHEREUM_NETWORK.shortName:
      return 'https://eth.drpc.org';
    case GANACHE_NETWORK.shortName:
    default:
      return 'http://network-contracts.docker:8545'; // default for local testing
  }
};

module.exports = {
  graphqlRequest,
  getTokenType,
  getRpcUrlParamName,
  getDevRpcUrl,
};
