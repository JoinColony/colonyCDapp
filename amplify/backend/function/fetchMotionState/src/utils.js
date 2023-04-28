const { providers, BigNumber } = require('ethers');
const {
  getColonyNetworkClient,
  Network,
  Extension,
} = require('@colony/colony-js');
const { default: fetch, Request } = require('node-fetch');

const { getColonyAction, updateColonyAction } = require('./graphql.js');

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

const getLatestMotionState = async (colonyAddress, motionData) => {
  const { nativeMotionId, createdBy } = motionData;
  try {
    const votingReputationClient = await getVotingClient(colonyAddress);
    const isDeprecated = await votingReputationClient.getDeprecated();
    /* Only fetch state for a motion that was created by the current (active) installation of the voting rep extn */
    if (!isDeprecated && votingReputationClient.address === createdBy) {
      return votingReputationClient.getMotionState(nativeMotionId);
    }
    return MotionState.Null;
  } catch {
    return MotionState.Null;
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

const getMotionData = async (transactionHash) => {
  const { data: actionData } = await graphqlRequest(getColonyAction, {
    id: transactionHash,
  });

  if (!actionData) {
    console.error(
      'Could not find motion in db. This is a bug and should be investigated.',
    );
  }

  return actionData?.getColonyAction?.motionData;
};

const getStakerReward = async (motionId, userAddress, colonyAddress) => {
  const votingReputationClient = await getVotingClient(colonyAddress);

  /*
   * If **anyone** staked on a side, calling the rewards function returns 0 if there's no reward (even for
   * a user who didnd't stake).
   *
   * But calling the rewards function on a side where **no one** has voted
   * will result in an error being thrown.
   *
   * Hence the try/catch.
   */
  let stakingRewardYay = BigNumber.from(0);
  let stakingRewardNay = BigNumber.from(0);
  try {
    [stakingRewardYay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      1,
    );
  } catch (error) {
    // We don't care to catch the error since we fallback to it's initial value
  }
  try {
    [stakingRewardNay] = await votingReputationClient.getStakerReward(
      motionId,
      userAddress,
      0,
    );
  } catch (error) {
    // silent error
  }

  return {
    address: userAddress,
    rewards: {
      nay: stakingRewardNay.toString(),
      yay: stakingRewardYay.toString(),
    },
    isClaimed: false,
  };
};

const didMotionPass = ({
  motionStakes: {
    raw: { yay: yayStakes, nay: nayStakes },
  },
  requiredStake,
  revealedVotes: {
    raw: { yay: yayVotes, nay: nayVotes },
  },
}) => {
  if (
    BigNumber.from(nayStakes).gte(requiredStake) &&
    BigNumber.from(yayStakes).gte(requiredStake)
  ) {
    /*
     * It only passes if the yay votes outnumber the nay votes
     * If the votes are equal, it fails
     */
    if (BigNumber.from(yayVotes).gt(nayVotes)) {
      return true;
    }

    return false;
  }

  if (BigNumber.from(yayStakes).eq(requiredStake)) {
    return true;
  }
  return false;
};

const updateStakerRewardsInDB = async (
  colonyAddress,
  transactionHash,
  motionData,
) => {
  const { nativeMotionId, usersStakes, stakerRewards } = motionData;

  const updatedStakerRewards = await Promise.all(
    // For every user who staked
    usersStakes.map(async ({ address: stakerAddress }) => {
      // Check if they have already had their reward calculated
      const existingStakerReward = stakerRewards.find(
        ({ address }) => address === stakerAddress,
      );

      // If not, get their reward
      if (!existingStakerReward) {
        return getStakerReward(nativeMotionId, stakerAddress, colonyAddress);
      }

      return existingStakerReward;
    }),
  );

  await graphqlRequest(updateColonyAction, {
    id: transactionHash,
    motionData: {
      ...motionData,
      stakerRewards: updatedStakerRewards,
    },
  });
};

const updateMotionMessagesInDB = async (
  transactionHash,
  motionData,
  motionMessage,
) => {
  const { messages } = motionData;
  const updatedMessages = [
    ...messages,
    {
      name: motionMessage,
      messageKey: `${transactionHash}_${motionMessage}}`,
    },
  ];

  await graphqlRequest(updateColonyAction, {
    id: transactionHash,
    motionData: {
      ...motionData,
      messages: updatedMessages,
    },
  });
};

module.exports = {
  getLatestMotionState,
  didMotionPass,
  updateStakerRewardsInDB,
  getMotionData,
  updateMotionMessagesInDB,
};
