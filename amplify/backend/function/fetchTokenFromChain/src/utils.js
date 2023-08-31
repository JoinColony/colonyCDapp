const { default: fetch, Request } = require('node-fetch');
const { constants } = require('ethers');

const TokenType = {
  COLONY: 'COLONY',
  ERC20: 'ERC20',
  CHAIN_NATIVE: 'CHAIN_NATIVE',
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

const BASE_NATIVE_TOKEN = {
  id: constants.AddressZero,
  type: 'CHAIN_NATIVE',
};

const ETHER_TOKEN = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  chainMetadata: {
    chainId: 1,
  },
};

const BINANCE_TOKEN = {
  name: 'Binance',
  symbol: 'BNB',
  decimals: 18,
  chainMetadata: {
    chainId: 56,
  },
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

const getChainNativeToken = (network) => {
  switch (network) {
    case BINANCE_NETWORK.shortName:
      return {
        ...BASE_NATIVE_TOKEN,
        ...BINANCE_TOKEN,
      };
    case ETHEREUM_NETWORK.shortName:
    default:
      return {
        ...BASE_NATIVE_TOKEN,
        ...ETHER_TOKEN,
      };
  }
};

module.exports = {
  graphqlRequest,
  getTokenType,
  ETHEREUM_NETWORK,
  BINANCE_NETWORK,
  getRpcUrlParamName,
  getChainNativeToken,
};
