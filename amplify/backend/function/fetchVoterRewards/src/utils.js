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
let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let networkAddress;
let network = Network.Custom;
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'sc') {
    const { getParams } = require('/opt/nodejs/getParams');
    [
      apiKey,
      graphqlURL,
      rpcURL,
      networkAddress,
      reputationOracleEndpoint,
      network,
    ] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'chainRpcEndpoint',
      'networkContractAddress',
      'reputationEndpoint',
      'chainNetwork',
    ]);
  } else {
    const {
      etherRouterAddress,
    } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    networkAddress = etherRouterAddress;
  }
};

const getNetworkClient = () => {
  const provider = new providers.JsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
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
  } catch {
    return undefined;
  }
};

const getVoterReward = async (colonyAddress, motionId, userReputation) => {
  const votingClient = await getVotingClient(colonyAddress);
  try {
    const reward = await votingClient.getVoterReward(
      BigNumber.from(motionId),
      BigNumber.from(userReputation),
    );
    return reward;
  } catch {
    return undefined;
  }
};

const graphqlRequest = async (queryOrMutation, variables) => {
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

  const request = new Request(graphqlURL, options);

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
  getVoterReward,
  setEnvVariables,
};
