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
const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');

Logger.setLogLevel(Logger.levels.ERROR);

const { calculatePercentageReputation } = require('./reputation');
const { graphqlRequest } = require('./utils');
const { getWatchersInColony } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
let reputationOracleEndpoint =
  'http://reputation-monitor.docker:3001/reputation/local';
let network = Network.Custom;
let networkAddress;

const SortingMethod = {
  BY_HIGHEST_REP: 'BY_HIGHEST_REP',
  BY_LOWEST_REP: 'BY_LOWEST_REP',
  // @NOTE - this might be useful in the future
  // BY_MORE_PERMISSIONS,
  // BY_LESS_PERMISSIONS,
};

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa') {
    const { getParams } = require('/opt/nodejs/getParams');
    [
      apiKey,
      graphqlURL,
      rpcURL,
      networkAddress,
      reputationOracleEndpoint,
      network,
    ] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
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

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  const {
    colonyAddress,
    rootHash,
    domainId = Id.RootDomain,
    sortingMethod = SortingMethod.BY_HIGHEST_REP,
  } = event?.arguments?.input || {};
  const provider = new providers.JsonRpcProvider(rpcURL);

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId || Id.RootDomain);
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
    graphqlURL,
    apiKey,
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
        domainId > Id.RootDomain
          ? [] // There will be no Watchers outside of the root domain
          : data?.getColonyByAddress?.items[0]?.watchers.items.map(
              ({ user }) => ({
                address: user.id,
                user,
              }),
            ),
    };
  }

  // Identify watchers & contributors
  data?.getColonyByAddress?.items[0]?.watchers.items.forEach((item) => {
    if (
      addressesWithReputation?.some(
        (address) => address.toLowerCase() === item.user.id.toLowerCase(),
      )
    ) {
      contributors.push({
        address: item.user.id,
        user: item.user,
      });
    } else {
      watchers.push({
        address: item.user.id,
        user: item.user,
      });
    }
  });

  // There will be no Watchers outside of the root domain
  if (domainId > Id.RootDomain) {
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
        address,
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
      const address = contributor.user
        ? contributor.user?.id
        : contributor.address;
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
          address: contributor.address,
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
