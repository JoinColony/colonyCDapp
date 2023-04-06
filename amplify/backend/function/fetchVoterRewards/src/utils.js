const { providers, BigNumber } = require('ethers');
const {
  getColonyNetworkClient,
  Network,
  Extension,
} = require('@colony/colony-js');
const { default: fetch, Request } = require('node-fetch');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

const getNetworkClient = () => {
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint:
      'http://reputation-monitor.docker:3001/reputation/local',
  });

  return networkClient;
};

const getVotingClient = async (colonyAddress) => {
  const networkClient = getNetworkClient();
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  return colonyClient.getExtensionClient(Extension.VotingReputation);
};

const getVoterRewardRange = async (
  colonyAddress,
  motionId,
  userReputation,
  userAddress,
) => {
  const votingClient = await getVotingClient(colonyAddress);
  try {
    const range = await votingClient.getVoterRewardRange(
      BigNumber.from(motionId),
      BigNumber.from(userReputation),
      userAddress,
    );
    return range;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const graphqlRequest = async (queryOrMutation, variables) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  const request = new Request(GRAPHQL_URI, options);

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

module.exports = {
  graphqlRequest,
  getVoterRewardRange,
};
