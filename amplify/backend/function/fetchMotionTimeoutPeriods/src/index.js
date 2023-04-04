const { providers } = require('ethers');
const {
  getColonyNetworkClient,
  Network,
  Extension,
  getBlockTime,
} = require('@colony/colony-js');

const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const provider = new providers.JsonRpcProvider(RPC_URL);
    const networkClient = getColonyNetworkClient(Network.Custom, provider, {
      networkAddress,
      reputationOracleEndpoint:
        'http://reputation-monitor.docker:3001/reputation/local',
    });

    const { motionId, colonyAddress } = event.arguments?.input || {};

    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const votingReputationClient = await colonyClient.getExtensionClient(Extension.VotingReputation);

    const blockTime =
    (await getBlockTime(networkClient.provider, 'latest')) || 0;

    const escalationPeriod = await votingReputationClient.getEscalationPeriod();

    const { events } = await votingReputationClient.getMotion(motionId);

    const timeLeftToStake = events[0].mul(1000).sub(blockTime);
    const timeLeftToSubmit = events[1].mul(1000).sub(blockTime);
    const timeLeftToReveal = events[2].mul(1000).sub(blockTime);
    const timeLeftToEscalate = timeLeftToReveal.add(escalationPeriod.mul(1000));

    return {
        timeLeftToStake: !timeLeftToStake.isNegative() ? timeLeftToStake.toString() : '0',
        timeLeftToSubmit: !timeLeftToSubmit.isNegative() ? timeLeftToSubmit.toString() : '0',
        timeLeftToReveal: !timeLeftToReveal.isNegative() ? timeLeftToReveal.toString() : '0',
        timeLeftToEscalate: !timeLeftToEscalate.isNegative() ? timeLeftToEscalate.toString() : '0',
    };
};
