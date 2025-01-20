require('cross-fetch/polyfill');
const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let networkAddress;
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';
let network = Network.Custom;

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
    throw new Error('Unable to set env variables. Reason:', e);
  }

  const input = event.arguments?.input;
  const colonyAddress = input?.colonyAddress;
  const walletAddress = input?.walletAddress;
  const domainId = input?.domainId;
  const rootHash = input?.rootHash;

  const provider = new providers.StaticJsonRpcProvider(rpcURL);

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
    disableVersionCheck: true,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  const { skillId } = await colonyClient.getDomain(domainId ?? Id.RootDomain);

  try {
    const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
      skillId,
      walletAddress,
      rootHash,
    );

    return reputationAmount.toString();
  } catch (e) {
    console.error(
      `Could not get reputation for ${walletAddress} in colony ${colonyAddress}`,
      e,
    );
    return null;
  }
};
