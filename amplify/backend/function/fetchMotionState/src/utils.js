const { providers, BigNumber, constants } = require('ethers');
const {
  getColonyNetworkClient,
  Network,
  Extension,
} = require('@colony/colony-js');
const { default: fetch, Request } = require('node-fetch');

const {
  getColonyMotion,
  updateColonyMotion,
  createMotionMessage,
  getColonyAction,
  updateColonyAction,
  getColony,
  updateColony,
} = require('./graphql.js');

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

const getLatestMotionState = async (
  colonyAddress,
  { nativeMotionId, createdBy },
) => {
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

const getMotionData = async (databaseMotionId) => {
  const { data: motionData } = await graphqlRequest(getColonyMotion, {
    id: databaseMotionId,
  });

  if (!motionData) {
    console.error(
      'Could not find motion in db. This is a bug and should be investigated.',
    );
  }

  return motionData?.getColonyMotion;
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
  const yayStake = BigNumber.from(yayStakes);
  if (
    BigNumber.from(nayStakes).gte(requiredStake) &&
    yayStake.gte(requiredStake)
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

  // in this case only the yayStake is equal to the required stake
  if (yayStake.eq(requiredStake)) {
    return true;
  }
  return false;
};

const updateColonyUnclaimedStakes = async (
  colonyAddress,
  databaseMotionId,
  updatedStakerRewards,
) => {
  const { data } = await graphqlRequest(getColony, {
    id: colonyAddress,
  });

  const motionsWithUnclaimedStakes =
    data?.getColony?.motionsWithUnclaimedStakes ?? [];

  const motionWithUnclaimedStake = motionsWithUnclaimedStakes?.find(
    ({ motionId }) => motionId === databaseMotionId,
  );

  const unclaimedRewards = updatedStakerRewards.filter(
    ({ isClaimed }) => !isClaimed,
  );

  if (!motionWithUnclaimedStake && unclaimedRewards.length) {
    motionsWithUnclaimedStakes.push({
      motionId: databaseMotionId,
      unclaimedRewards,
    });
  }

  /* Update unclaimed motions on colony */
  await graphqlRequest(updateColony, {
    input: {
      id: colonyAddress,
      motionsWithUnclaimedStakes,
    },
  });
};

const updateStakerRewardsInDB = async (colonyAddress, motionData) => {
  const {
    nativeMotionId,
    usersStakes,
    stakerRewards,
    id: motionId,
  } = motionData;

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

  await graphqlRequest(updateColonyMotion, {
    input: {
      id: motionId,
      stakerRewards: updatedStakerRewards,
    },
  });

  await updateColonyUnclaimedStakes(
    colonyAddress,
    motionId,
    updatedStakerRewards,
  );
};

const updateMotionMessagesInDB = async (motionData, motionMessages, flag) => {
  const { messages, motionStateHistory } = motionData;
  const updatedStateHistory = {
    ...motionStateHistory,
    [flag]: true,
  };

  const messageKeys = new Set(messages.items.map((m) => m.messageKey));

  const newMessagesPromises = motionMessages
    .filter((message) => !messageKeys.has(`${motionData.id}_${message}`))
    .map((message) =>
      graphqlRequest(createMotionMessage, {
        input: {
          initiatorAddress: constants.AddressZero,
          name: message,
          messageKey: `${motionData.id}_${message}`,
          motionId: motionData.id,
        },
      }),
    );

  await Promise.all(newMessagesPromises);

  await graphqlRequest(updateColonyMotion, {
    input: {
      id: motionData.id,
      motionStateHistory: updatedStateHistory,
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
