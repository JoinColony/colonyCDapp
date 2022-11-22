const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
  BigNumber,
} = require('ethers');
const { constants } = require('ethers');
const { Decimal } = require('decimal.js');

Logger.setLogLevel(Logger.levels.ERROR);

const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

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
  if (!userReputation || !totalReputation) return null;
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
  const input = event.arguments?.input;
  const colonyAddress = input?.colonyAddress;
  const walletAddress = input?.walletAddress;
  const rootHash = input?.rootHash;

  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint:
      'http://reputation-monitor.docker:3001/reputation/local',
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
            ? ROOT_DOMAIN_ID
            : userReputation.domainId,
        );

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

    // return { items: formattedUserReputationsResult };
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
          reputationB.domainId !== ROOT_DOMAIN_ID
        ) {
          return -1;
        }
        return 1;
      })
      .slice(0, 3);

    return { items: topUserReputations };
  } catch (error) {
    return error.toString();
  }
};
