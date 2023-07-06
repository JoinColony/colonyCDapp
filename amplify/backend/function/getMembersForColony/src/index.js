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
const { getWatchersInColony, getUserByAddress } = require('./graphql');

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

  const networkClient = getColonyNetworkClient(network, provider, {
    networkAddress,
    reputationOracleEndpoint,
  });

  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId || Id.RootDomain);
  let contributorAddresses = new Set();

  try {
    const { addresses } = await colonyClient.getMembersReputation(skillId);
    contributorAddresses = new Set(
      addresses.map((address) => address.toLowerCase()),
    );
  } catch (error) {
    // @NOTE Not throwing an error here, because it's possbile that the colony
    // doesn't have any reputation yet.
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

  const allColonyWatchers = data?.getColonyByAddress?.items[0]?.watchers.items;

  // Incase there are members but no reputation on the colony,
  // we can stop here and return the list of watchers
  if (!contributorAddresses.size) {
    if (domainId > Id.RootDomain) {
      return {
        contributors: [],
        watchers: [], // You can only "watch" the root domain.
      };
    }

    return {
      contributors: [],
      watchers: allColonyWatchers.map(({ user }) => ({
        address: user.id,
        user,
      })),
    };
  }

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
    // If domain has no reputation, either it's the root domain, in which case we've already returned early above
    // Or it's a subdomain, in which case we can return two empty arrays since you can't watch a subdomain
    return {
      contributors: [],
      watchers: [],
    };
  }

  /*
   * A "watcher" (for ui purposes) is an address with 0 reputation in a colony && that is subscribed to/watching/joined to that colony.
   * Watchers belong exclusively to the root domain. There are no watchers of subdomains.
   *
   * Note: the terminology we use internally is inconsistent in this respect. For instance, the "watchers" field
   * on the Colony model refers to all addresses that are joined to the colony, not just those that are joined and
   * have 0 reputation.
   */

  // Get addresses subscribed to the colony that don't have reputation
  const watchersWithoutRep = allColonyWatchers.reduce((watchers, watcher) => {
    if (watcher) {
      const userAddress = watcher.user.id.toLowerCase();
      if (!contributorAddresses.has(userAddress)) {
        watchers.push({
          ...watcher,
          address: userAddress,
        });
      }
    }
    return watchers;
  }, []);

  const contributors = await Promise.all(
    [...contributorAddresses].map(async (address) => {
      try {
        const { data: query } = await graphqlRequest(
          getUserByAddress,
          { id: utils.getAddress(address) },
          graphqlURL,
          apiKey,
        );

        const user = query?.getUserByAddress?.items[0];

        const { reputationAmount } =
          await colonyClient.getReputationWithoutProofs(
            skillId,
            address,
            rootHash,
          );

        const repPercentage = calculatePercentageReputation(
          reputationAmount,
          reputationInDomain,
        );

        return {
          address,
          user: user ?? null,
          reputationAmount: reputationAmount.toString(),
          reputationPercentage:
            repPercentage === null ? repPercentage : repPercentage.toString(),
        };
      } catch (e) {
        throw new Error(
          `Error trying to get reputation for contributor ${address} at skillId ${skillId}: ${e?.message}`,
        );
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

  return {
    contributors,
    watchers: watchersWithoutRep,
  };
};
