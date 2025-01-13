require('cross-fetch/polyfill');
const { providers } = require('ethers');
const {
  getColonyNetworkClient,
  Network,
  Extension,
  getBlockTime,
} = require('@colony/colony-js');

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let networkAddress;
let network = Network.Custom;
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [rpcURL, networkAddress, reputationOracleEndpoint, network] =
      await getParams([
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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw Error('Unable to set environment variables. Reason:', e);
  }
  const provider = new providers.StaticJsonRpcProvider(rpcURL);
  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
    disableVersionCheck: true,
  });

  const { motionId, colonyAddress } = event.arguments?.input || {};

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const votingReputationClient = await colonyClient.getExtensionClient(
    Extension.VotingReputation,
  );

  const blockTime = (await getBlockTime('latest', networkClient.provider)) || 0;

  const escalationPeriod = await votingReputationClient.getEscalationPeriod();

  const { events } = await votingReputationClient.getMotion(motionId);

  const timeLeftToStake = events[0].mul(1000).sub(blockTime);
  const timeLeftToVote = events[1].mul(1000).sub(blockTime);
  const timeLeftToReveal = events[2].mul(1000).sub(blockTime);
  const timeLeftToEscalate = timeLeftToReveal.add(escalationPeriod.mul(1000));

  return {
    timeLeftToStake: !timeLeftToStake.isNegative()
      ? timeLeftToStake.toString()
      : '0',
    timeLeftToVote: !timeLeftToVote.isNegative()
      ? timeLeftToVote.toString()
      : '0',
    timeLeftToReveal: !timeLeftToReveal.isNegative()
      ? timeLeftToReveal.toString()
      : '0',
    timeLeftToEscalate: !timeLeftToEscalate.isNegative()
      ? timeLeftToEscalate.toString()
      : '0',
  };
};
