const { Extension, getLogs } = require('@colony/colony-js');
const { utils } = require('ethers');

const ContractEventSignatures = {
  MotionStaked: 'MotionStaked(uint256,address,uint256,uint256)',
  MotionRewardClaimed: 'MotionRewardClaimed(uint256,address,uint256,uint256)',
};

const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

exports.getStakedTokens = async (colonyAddress, networkClient) => {
  try {
    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const votingReputationClient = await colonyClient.getExtensionClient(
      Extension.VotingReputation,
    );
    const votingReputationAddress = votingReputationClient.address;

    const motionStakedFilter = {
      topics: [utils.id(ContractEventSignatures.MotionStaked)],
      address: votingReputationAddress,
    };
    const motionStakedLogs = getLogs(
      votingReputationClient,
      motionStakedFilter,
    );

    return 0;
  } catch {
    return 0;
  }
};
