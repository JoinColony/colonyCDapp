/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */

const { Decimal } = require('decimal.js');
const { constants, utils } = require('ethers');
const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

const { calculatePercentageReputation } = require('./reputation');
const { graphqlRequest } = require('./utils');
const { getWatchersInColony } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

const ALL_DOMAIN_ID = 0;
const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const REPUTATION_ENDPOINT = 'http://network-contracts:3002';

const SortingMethod = {
  BY_HIGHEST_REP: 'BY_HIGHEST_REP',
  BY_LOWEST_REP: 'BY_LOWEST_REP',
  // @NOTE - this might be useful in the future
  // BY_MORE_PERMISSIONS,
  // BY_LESS_PERMISSIONS,
};

exports.handler = async (event) => {
  const {
    colonyAddress,
    rootHash,
    domainId = ROOT_DOMAIN_ID,
    sortingMethod = SortingMethod.BY_HIGHEST_REP,
  } = event?.arguments?.input || {};
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
    // eslint-disable-next-line global-require
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint: REPUTATION_ENDPOINT,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId);
  const { addresses: addressesWithReputation } =
    await colonyClient.getMembersReputation(skillId);

  const watchers = [];
  const contributors = [];

  /*
   * Validate Colony addresses
   */
  let checksummedAddress;
  try {
    checksummedAddress = utils.getAddress(colonyAddress);
  } catch (error) {
    throw new Error(
      `Colony address "${colonyAddress}" is not valid (after checksum)`,
    );
  }

  // get list of watchers for colony
  if (domainId === ALL_DOMAIN_ID || domainId === ROOT_DOMAIN_ID) {
    const { data, errors } = await graphqlRequest(
      getWatchersInColony,
      { id: checksummedAddress },
      GRAPHQL_URI,
      API_KEY,
    );

    if (errors || !data) {
      const [error] = errors;
      throw new Error(
        error?.message || 'Could not fetch colony data from DynamoDB',
      );
    }

    // Identify watchers & contributors
    data?.getColonyByAddress?.items[0]?.watchers.items.forEach((item) => {
      if (
        addressesWithReputation?.every(
          (address) => address.toLowerCase() !== item.user.id.toLowerCase(),
        )
      ) {
        watchers.push(item);
      } else {
        contributors.push(item);
      }
    });

    // now catch addresses that have reputation but are not in the watchers list
    // i.e. address that was awarded reputation but has not joined the colony
    if (addressesWithReputation.length !== contributors.length) {
      const missingAddresses = addressesWithReputation.filter((address) =>
        contributors?.every(
          (item) => item.user.id.toLowerCase() !== address.toLowerCase(),
        ),
      );

      missingAddresses.forEach((address) => {
        contributors.push({
          user: {
            id: address,
          },
        });
      });
    }
  }

  // Get total reputation for colony
  let totalColonyReputation;
  try {
    totalColonyReputation = await colonyClient.getReputationWithoutProofs(
      skillId,
      constants.AddressZero,
      rootHash,
    );
  } catch (error) {
    // Not throwing anything, as its possible that the domain does not have
    // any reputation, and we don't want to break the whole query
  }

  // get reputation for each address
  const contributorsWithReputation = await Promise.all(
    contributors.map(async (contributor) => {
      const address = contributor.user?.id;
      try {
        const userReputationForAllDomains =
          await colonyClient.getReputationAcrossDomains(address, rootHash);

        // Filter based on domainId if provided
        const filteredReputationForAllDomains =
          userReputationForAllDomains.filter(
            (userReputation) =>
              userReputation.reputationAmount &&
              !userReputation.reputationAmount.isZero() &&
              userReputation.domainId === domainId,
          );

        // Extract only the relevant data and
        // transform the user reputation amount on each domain to percentage
        const formattedUserReputations = filteredReputationForAllDomains.map(
          (userReputation) => {
            if (!userReputation?.reputationAmount) {
              return {};
            }

            const reputationPercentage = calculatePercentageReputation(
              userReputation.reputationAmount?.toString(),
              totalColonyReputation.reputationAmount?.toString(),
            );

            return {
              reputationPercentage,
              reputationAmount: userReputation.reputationAmount?.toString(),
            };
          },
        );

        return {
          user: contributor.user,
          reputationPercentage:
            formattedUserReputations[0]?.reputationPercentage,
          reputationAmount: formattedUserReputations[0]?.reputationAmount,
        };
      } catch (error) {
        throw new Error(
          `Error trying to calculate reputation for user ${address}: ${error.message}`,
        );
      }
    }),
  );

  const sortedContributors = (() => {
    return contributorsWithReputation.sort((contributor1, contributor2) => {
      if (sortingMethod === SortingMethod.BY_HIGHEST_REP) {
        return new Decimal(contributor2?.reputationPercentage)
          .sub(contributor1.reputationPercentage)
          .toNumber();
      }
      if (sortingMethod === SortingMethod.BY_LOWEST_REP) {
        return new Decimal(contributor1.reputationPercentage)
          .sub(contributor2.reputationPercentage)
          .toNumber();
      }

      // @NOTE - this might be useful in the future
      // if (sortingMethod === SortingMethod.BY_MORE_PERMISSIONS) {
      //   return user2.roles.length - user1.roles.length;
      // }
      // if (sortingMethod === SortingMethod.BY_LESS_PERMISSIONS) {
      //   return user1.roles.length - user2.roles.length;
      // }

      return 0;
    });
  })();

  return {
    contributors: sortedContributors,
    watchers,
  };
};
