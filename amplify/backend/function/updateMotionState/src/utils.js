const { providers } = require('ethers');
const { default: fetch, Request } = require('node-fetch');
const {
  getColonyNetworkClient,
  Network,
  Extension,
} = require('@colony/colony-js');
const { updateColonyAction, getColonyAction } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

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

const getColonyActionFromDB = (transactionHash) =>
  graphqlRequest(
    getColonyAction,
    {
      id: transactionHash,
    },
    GRAPHQL_URI,
    API_KEY,
  );

const updateColonyActionInDB = (transactionHash, motionData) =>
  graphqlRequest(
    updateColonyAction,
    {
      input: {
        id: transactionHash,
        motionData,
      },
    },
    GRAPHQL_URI,
    API_KEY,
  );

const getLatestMotionState = async (colonyAddress, motionId) => {
  const votingReputationClient = await getVotingClient(colonyAddress);
  return votingReputationClient.getMotionState(motionId);
};

const POLLING_FREQUENCY = 1000;
const POLLING_TIMEOUT = 1000 * 30; // 30 seconds

const pollForColonyAction = async (transactionHash, actionData) => {
  const now = new Date().valueOf();
  const end = now + POLLING_TIMEOUT;
  while (!actionData.motionData.stakerRewards.length) {
    let timeout;
    const currentTime = new Date().valueOf();
    /* If timeout has elapsed, stop polling */
    if (currentTime >= end) {
      clearTimeout(timeout);
      break;
    } else {
      /* Else, make a call to the db */
      await new Promise((resolve) => {
        timeout = setTimeout(async () => {
          const { data } = await getColonyActionFromDB(transactionHash);
          actionData = data?.getColonyAction;
          resolve();
        }, POLLING_FREQUENCY);
      });
    }
  }

  return actionData;
};

module.exports = {
  getVotingClient,
  updateColonyActionInDB,
  getColonyActionFromDB,
  getLatestMotionState,
  pollForColonyAction,
};
