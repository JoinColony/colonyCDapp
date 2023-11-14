const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
  BigNumber,
} = require('ethers');
const { constants } = require('ethers');
const { Decimal } = require('decimal.js');

Logger.setLogLevel(Logger.levels.ERROR);

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'sc') {
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

const ZeroValue = {
  Zero: '0',
  NearZero: '~0',
};
const DECIMAL_PLACES = 2;
const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;

const calculatePercentageReputation = (
  userReputation,
  totalReputation,
  decimalPlaces = DECIMAL_PLACES,
) => {
  if (!userReputation || !totalReputation) {
    return null;
  }

  const userReputationNumber = BigNumber.from(userReputation);
  const totalReputationNumber = BigNumber.from(totalReputation);

  const reputationSafeguard = BigNumber.from(100).pow(decimalPlaces);

  if (userReputationNumber.isZero() || totalReputationNumber.isZero()) {
    return ZeroValue.Zero;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return ZeroValue.NearZero;
  }

  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};

/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  const { colonyAddress, walletAddress, rootHash } =
    event.arguments?.input || {};

  const provider = new providers.JsonRpcProvider(rpcURL);

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);

  try {
    const userReputationForAllDomains =
      await colonyClient.getReputationAcrossDomains(walletAddress, rootHash);

    // Extract only the relevant data and
    // transform the user reputation amount on each domain to percentage
    const formattedUserReputations = userReputationForAllDomains.map(
      async (userReputation) => {
        const { skillId } = await colonyClient.getDomain(
          /*
           * If we have the "All Teams" domain selected, fetch reputation values from "Root"
           */
          userReputation.domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
            ? Id.RootDomain
            : userReputation.domainId,
        );

        if (!userReputation.reputationAmount) {
          return {
            reputationPercentage: '0',
            domainId: userReputation.domainId,
          };
        }

        const { reputationAmount: totalColonyReputation } =
          await colonyClient.getReputationWithoutProofs(
            skillId,
            constants.AddressZero,
            rootHash,
          );

        const reputationPercentage = totalColonyReputation
          ? calculatePercentageReputation(
              userReputation.reputationAmount?.toString(),
              totalColonyReputation.toString(),
            )
          : 0;
        return {
          reputationPercentage,
          domainId: userReputation.domainId,
        };
      },
    );
    const formattedUserReputationsResult = await Promise.all(
      formattedUserReputations,
    );

    // Filter out the reputation percentages that are 0
    const filteredUserReputations = formattedUserReputationsResult.filter(
      (userReputation) =>
        userReputation.reputationPercentage &&
        userReputation.reputationPercentage !== ZeroValue.Zero,
    );

    // Sort out the percentages from highest to lowest
    // and extract up to 3 reputations from the array
    const topUserReputations = [...filteredUserReputations]
      .sort((reputationA, reputationB) => {
        const safeReputationA = new Decimal(
          reputationA?.reputationPercentage &&
          reputationA?.reputationPercentage !== ZeroValue.NearZero
            ? reputationA.reputationPercentage
            : 0,
        );
        const safeReputationB = new Decimal(
          reputationB?.reputationPercentage &&
          reputationB?.reputationPercentage !== ZeroValue.NearZero
            ? reputationB.reputationPercentage
            : 0,
        );

        if (safeReputationB.eq(safeReputationA)) {
          return 0;
        }
        if (
          safeReputationB.lt(safeReputationA) &&
          reputationB.domainId !== Id.RootDomain
        ) {
          return -1;
        }
        return 1;
      })
      .slice(0, 3);

    return { items: topUserReputations };
  } catch (error) {
    console.error(error);
    return null;
  }
};
