/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */

const { Decimal } = require('decimal.js');
const {
  constants,
  utils,
  providers,
  utils: { Logger },
} = require('ethers');
const { getColonyNetworkClient, Network } = require('@colony/colony-js');

Logger.setLogLevel(Logger.levels.ERROR);

const { calculatePercentageReputation } = require('./reputation');
const { graphqlRequest } = require('./utils');
const { getWatchersInColony } = require('./graphql');

let networkAddress;
try {
  const artifacts = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
  networkAddress = artifacts.etherRouterAddress;
} catch (error) {
  // silent error
  // means we're in a production environment without access to the contract build artifacts
}

const API_KEY = process.env.APPSYNC_API_KEY || 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';
const RPC_URL =
  process.env.CHAIN_RPC_ENDPOINT || 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const REPUTATION_ENDPOINT =
  process.env.REPUTATION_ENDPOINT || 'http://network-contracts:3002';
const NETWORK = process.env.CHAIN_RPC_ENDPOINT || Network.Custom;
const NETWORK_ADDRESS = process.env.CHAIN_NETWORK_CONTRACT || networkAddress;

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

  const networkClient = getColonyNetworkClient(NETWORK, provider, {
    networkAddress: NETWORK_ADDRESS,
    reputationOracleEndpoint: REPUTATION_ENDPOINT,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId || ROOT_DOMAIN_ID);
  let addressesWithReputation;
  try {
    const { addresses } = await colonyClient.getMembersReputation(skillId);
    addressesWithReputation = addresses;
  } catch (error) {
    // @NOTE Not throwing an error here, because its possbile that the colony
    // doesn't have any reputation yet.
  }

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

  // Incase there are members but no reputation on the colony,
  // we can stop here and return the list of watchers
  if (!addressesWithReputation?.length) {
    return {
      contributors: [],
      watchers:
        domainId > ROOT_DOMAIN_ID
          ? [] // There will be no Watchers outside of the root domain
          : data?.getColonyByAddress?.items[0]?.watchers.items,
    };
  }

  // Identify watchers & contributors
  data?.getColonyByAddress?.items[0]?.watchers.items.forEach((item) => {
    if (
      addressesWithReputation?.some(
        (address) => address.toLowerCase() === item.user.id.toLowerCase(),
      )
    ) {
      contributors.push(item);
    } else {
      watchers.push(item);
    }
  });

  // There will be no Watchers outside of the root domain
  if (domainId > ROOT_DOMAIN_ID) {
    watchers.length = 0;
  }

  // now catch addresses that have reputation but are not in the watchers list
  // i.e. address that was awarded reputation but has not joined the colony
  if (addressesWithReputation?.length !== contributors?.length) {
    const missingAddresses = addressesWithReputation?.filter((address) =>
      contributors?.every(
        (item) => item.user.id.toLowerCase() !== address.toLowerCase(),
      ),
    );

    missingAddresses?.forEach((address) => {
      contributors?.push({
        user: {
          id: address,
        },
      });
    });
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
              !userReputation.reputationAmount.isZero(),
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
        throw Error(
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
