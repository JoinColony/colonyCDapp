const fetch = require('cross-fetch');

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

  let body;
  let response;

  try {
    response = await fetch(url, options);
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

const GANACHE_NETWORK_1 = {
  chainId: '265669101',
  rpcUrl: 'http://network-contracts-remote:8545',
};

const GANACHE_NETWORK_2 = {
  chainId: '265669101',
  rpcUrl: 'http://network-contracts-remote-2:8545',
};

// @TODO: Add the other supported networks
// const SUPPORTED_NETWORK = {
//   chainId: '1',
//   rpcUrl: '#',
// };

const SUPPORTED_NETWORKS = [GANACHE_NETWORK_1, GANACHE_NETWORK_2];

const getRpcUrlByChainId = (chainId) => {
  const network = SUPPORTED_NETWORKS.find((net) => net.chainId === chainId);

  if (!network) {
    console.error(`RPC URL not found for chain ID: ${chainId}`);
    return null;
  }

  return network.rpcUrl;
};

module.exports = {
  graphqlRequest,
  getRpcUrlByChainId,
};
