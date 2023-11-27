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
const { getWatchersInColony, getUserByAddress } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';
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
  if (ENV === 'qa' || ENV === 'sc') {
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

/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  const {
    colonyAddress: address,
    rootHash,
    domainId: nativeDomainId = Id.RootDomain,
    sortingMethod = SortingMethod.BY_HIGHEST_REP,
  } = event?.arguments?.input || {};
  const provider = new providers.JsonRpcProvider(rpcURL);

  /*
   * Validate Colony addresses
   */
  let colonyAddress;
  try {
    colonyAddress = utils.getAddress(address);
  } catch (error) {
    throw new Error(
      `Colony address "${colonyAddress}" is not valid (after checksum)`,
    );
  }

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(nativeDomainId);
  let contributorAddresses = new Set();

  try {
    const { addresses } = await colonyClient.getMembersReputation(skillId);
    contributorAddresses = new Set(
      addresses.map((contributorAddress) => contributorAddress.toLowerCase()),
    );
  } catch (error) {
    // @NOTE Not throwing an error here, because it's possbile that the colony
    // doesn't have any reputation yet.
  }

  // get list of watchers for colony
  const allWatchersResponse = await graphqlRequest(
    getWatchersInColony,
    { id: colonyAddress, domainId: `${colonyAddress}_${nativeDomainId}` },
    graphqlURL,
    apiKey,
  );

  const { data, errors } = allWatchersResponse ?? {};

  if (errors || !data) {
    const [error] = errors;
    throw new Error(
      error?.message || 'Could not fetch colony data from DynamoDB',
    );
  }

  const allColonyWatchers = data?.getColonyByAddress?.items[0]?.watchers.items;

  // Get total reputation for colony
  let reputationInDomain;
  try {
    const { reputationAmount } = await colonyClient.getReputationWithoutProofs(
      skillId,
      constants.AddressZero,
      rootHash,
    );
    reputationInDomain = reputationAmount;
  } catch (error) {
    // Silent error in case there's no reputation in the domain
  }

  /*
   * A "watcher" (for ui purposes) is an address with 0 reputation in a colony, has no permissions and that is subscribed to that colony.
   * Watchers belong exclusively to the root domain. There are no watchers of subdomains.
   *
   * Note: the terminology we use internally is inconsistent in this respect. For instance, the "watchers" field
   * on the Colony model refers to all addresses that are joined to the colony, not just those that are joined and
   * have 0 reputation, and have no permissions assigned.
   */

  // Get addresses subscribed to the colony that don't have reputation or permissions
  // And add addresses with permissions to the contributors set
  const watchersWithoutRepOrPermissions = allColonyWatchers.reduce(
    (watchers, watcher) => {
      if (watcher) {
        const userAddress = watcher.user.id.toLowerCase();
        const permissions = watcher.user.roles?.items[0] ?? {}; // query is filtered by domainId
        const hasPermissions = Object.keys(permissions).some(
          (permissionKey) => permissions[permissionKey],
        );

        if (!contributorAddresses.has(userAddress)) {
          if (!hasPermissions) {
            watchers.push({
              ...watcher,
              address: userAddress,
            });
          } else {
            // A user can also become a contributor if they are assigned any permissions
            contributorAddresses.add(userAddress);
          }
        }
      }
      return watchers;
    },
    [],
  );

  const contributors = await Promise.all(
    [...contributorAddresses].map(async (contributorAddress) => {
      const response = await graphqlRequest(
        getUserByAddress,
        { id: utils.getAddress(contributorAddress) },
        graphqlURL,
        apiKey,
      );

      const user = response?.data?.getUserByAddress?.items[0];
      try {
        const { reputationAmount } =
          await colonyClient.getReputationWithoutProofs(
            skillId,
            contributorAddress,
            rootHash,
          );

        const repPercentage = calculatePercentageReputation(
          reputationAmount,
          reputationInDomain,
        );

        return {
          address: contributorAddress,
          user: user ?? null,
          reputationAmount: reputationAmount.toString(),
          reputationPercentage:
            repPercentage === null ? repPercentage : repPercentage.toString(),
        };
      } catch (e) {
        return {
          address: contributorAddress,
          user: user ?? null,
          reputationAmount: '0',
          reputationPercentage: '0',
        };
      }
    }),
  );

  // sort contributors by method provided to lambda
  switch (sortingMethod) {
    case SortingMethod.BY_HIGHEST_REP: {
      contributors.sort((contributor1, contributor2) => {
        return new Decimal(contributor2.reputationAmount)
          .sub(contributor1.reputationAmount)
          .toNumber();
      });
      break;
    }

    case SortingMethod.BY_LOWEST_REP: {
      contributors.sort((contributor1, contributor2) => {
        return new Decimal(contributor1.reputationAmount)
          .sub(contributor2.reputationAmount)
          .toNumber();
      });
      break;
    }

    default: {
      break;
    }
  }

  // @NOTE - this might be useful in the future
  // if (sortingMethod === SortingMethod.BY_MORE_PERMISSIONS) {
  //   return user2.roles.length - user1.roles.length;
  // }
  // if (sortingMethod === SortingMethod.BY_LESS_PERMISSIONS) {
  //   return user1.roles.length - user2.roles.length;
  // }

  if (nativeDomainId > Id.RootDomain) {
    return {
      contributors,
      watchers: [], // You can only "watch" the root domain.
    };
  }

  return {
    contributors,
    watchers: watchersWithoutRepOrPermissions,
  };
};
