require('cross-fetch/polyfill');
const { getColonyNetworkClient, Network, Id, w } = require('@colony/colony-js');
const {
  providers,
  constants: { AddressZero },
  utils: { Logger, getAddress },
  BigNumber,
} = require('ethers');

const {
  getContributorReputation,
  getColony,
  updateColony,
  getColonyContributor,
  getReputationMiningCycleMetadata,
} = require('./graphql');

const {
  graphqlRequest,
  getContributorType,
  sortAddressesDescendingByReputation,
  createContributorReputationInDb,
  updateContributorReputationInDb,
  updateColonyContributorInDb,
  createColonyContributorInDb,
  reputationMiningCycleMetadataId,
  updateReputationInDomain,
  getDomainDatabaseId,
  calculatePercentageReputation,
} = require('./utils');

Logger.setLogLevel(Logger.levels.ERROR);

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let networkAddress;
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';
let network = Network.Custom;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
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
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  try {
    const { colonyAddress } = event.arguments?.input ?? {};

    if (!colonyAddress) {
      return true;
    }

    console.log(`Colony ${colonyAddress} reputation update started`);

    const provider = new providers.StaticJsonRpcProvider(rpcURL);

    const networkClient = getColonyNetworkClient(network, provider, {
      networkAddress,
      reputationOracleEndpoint,
    });

    // get the current colony from the db, along with it's domain information
    const { data } =
      (await graphqlRequest(
        getColony,
        { colonyAddress },
        graphqlURL,
        apiKey,
      )) ?? {};

    const colony = data?.getColony ?? {};
    const domains = colony?.domains?.items ?? [];
    const rootDomain = domains.find(({ isRoot }) => isRoot);

    // TODO Remove usage of colonyJS
    const colonyClient = await networkClient.getColonyClient(colonyAddress);

    let totalRepInColony;
    try {
      ({ reputationAmount: totalRepInColony } =
        await colonyClient.getReputationWithoutProofs(
          BigNumber.from(rootDomain.nativeSkillId),
          AddressZero,
        ));
    } catch (e) {
      console.error('Could not get total reputation in colony', e);
      // may error if there's no rep in colony. In that case, there are no contributors to update.
      return true;
    }

    console.log({ totalRepInColony: totalRepInColony?.toString() });

    // query database rep metadata
    const { data: response } =
      (await graphqlRequest(
        getReputationMiningCycleMetadata,
        { id: reputationMiningCycleMetadataId },
        graphqlURL,
        apiKey,
      )) ?? {};

    const lastUpdatedCache =
      colony?.lastUpdatedContributorsWithReputation || null;

    const lastReputationMiningCycleCompletion =
      response?.getReputationMiningCycleMetadata?.lastCompletedAt;

    console.log({
      lastUpdatedCache,
      lastReputationMiningCycleCompletion,
      willUpdateCache: !(
        new Date(lastReputationMiningCycleCompletion).valueOf() <
        new Date(lastUpdatedCache).valueOf()
      ),
      // willUpdateCache: 'forced true',
    });

    // TODO use latest hash to decide if to update reputation
    // We only need to update the cache if the reputation mining cycle has completed since the last time we updated the cache
    if (
      new Date(lastReputationMiningCycleCompletion).valueOf() <
      new Date(lastUpdatedCache).valueOf()
    ) {
      return true;
    }

    const promiseResults = await Promise.allSettled(
      domains.map(async ({ nativeId, nativeSkillId, isRoot }) => {
        const skillId = BigNumber.from(nativeSkillId);
        let addresses;
        let totalRepInDomain;

        try {
          ({ addresses } = await colonyClient.getMembersReputation(skillId));
          ({ reputationAmount: totalRepInDomain } =
            await colonyClient.getReputationWithoutProofs(
              skillId,
              AddressZero,
            ));
        } catch (e) {
          // can error if no rep in domain. skip in this case.
          return;
        }

        // update total rep in domain in db
        await updateReputationInDomain({
          databaseDomainId: getDomainDatabaseId(colonyAddress, nativeId),
          apiKey,
          graphqlURL,
          reputation: totalRepInDomain.toString(),
          colonyReputation: totalRepInColony.toString(),
        });

        // For each domain, sort addresses by reputation, get the contributor type, and
        // update the database with the corresponding Contributor entry

        // This will take a long time depending on how many reputation holders there are
        const sortedAddresses = await sortAddressesDescendingByReputation(
          colonyClient,
          skillId,
          addresses,
        );

        const totalAddresses = sortedAddresses.length;

        console.log({
          nativeId,
          nativeSkillId,
          totalRepInDomain: totalRepInDomain?.toString(),
          addressesWithReputation: JSON.stringify(
            sortedAddresses.map(({ address, reputationBN }) => ({
              address,
              reputationBN: reputationBN.toString(),
            })),
          ),
        });

        const promiseStatuses = await Promise.allSettled(
          sortedAddresses.map(async ({ address, reputationBN }, idx) => {
            const contributorAddress = getAddress(address);

            const colonyReputationPercentage = calculatePercentageReputation(
              reputationBN,
              totalRepInColony,
            );

            const domainReputationPercentage = calculatePercentageReputation(
              reputationBN,
              totalRepInDomain,
            );

            const contributorReputationId = `${colonyAddress}_${nativeId}_${contributorAddress}`;
            const colonyContributorId = `${colonyAddress}_${contributorAddress}`;
            const reputation = reputationBN.toString();

            const { data: repResponse } =
              (await graphqlRequest(
                getContributorReputation,
                { id: contributorReputationId },
                graphqlURL,
                apiKey,
              )) ?? {};

            // If root domain, check if we have a contributor entry
            if (isRoot) {
              const { data: contributorResponse } =
                (await graphqlRequest(
                  getColonyContributor,
                  { id: colonyContributorId },
                  graphqlURL,
                  apiKey,
                )) ?? {};

              if (contributorResponse?.getColonyContributor) {
                const { createdAt } =
                  repResponse?.getContributorReputation ??
                  new Date().toISOString();

                const type = getContributorType(totalAddresses, idx, createdAt);

                await updateColonyContributorInDb({
                  id: colonyContributorId,
                  type,
                  colonyReputationPercentage,
                  graphqlURL,
                  apiKey,
                });
              } else {
                const type = getContributorType(
                  totalAddresses,
                  idx,
                  new Date().toISOString(),
                );

                await createColonyContributorInDb({
                  id: colonyContributorId,
                  type,
                  contributorAddress,
                  colonyAddress,
                  colonyReputationPercentage,
                  graphqlURL,
                  apiKey,
                });
              }
            }

            // for every domain, add / update contributor reputation entry

            if (repResponse?.getContributorReputation) {
              await updateContributorReputationInDb({
                id: contributorReputationId,
                reputationRaw: reputation,
                reputationPercentage: domainReputationPercentage,
                graphqlURL,
                apiKey,
              });
            } else {
              await createContributorReputationInDb({
                colonyAddress,
                contributorAddress,
                nativeId,
                id: contributorReputationId,
                reputationRaw: reputation,
                reputationPercentage: domainReputationPercentage,
                graphqlURL,
                apiKey,
              });
            }
          }),
        );

        // Ensure errors propagate up
        for (const { status, reason } of promiseStatuses) {
          if (status === 'rejected') {
            throw new Error(reason);
          }
        }
      }),
    );

    /*
     * Here we'll be able to see if any of the promises rejected and why
     */
    let allFulfilled = true;

    for (const { status, reason } of promiseResults) {
      if (status === 'rejected') {
        console.log(
          `ERROR: Some reputation entries could not be processed -- ${reason}`,
        );
        allFulfilled = false;
      }
    }

    // Update colony object with the time, so we can keep track of when this function gets called

    await graphqlRequest(
      updateColony,
      {
        input: {
          id: colonyAddress,
          lastUpdatedContributorsWithReputation: new Date().toISOString(),
          reputation: totalRepInColony.toString(),
        },
      },
      graphqlURL,
      apiKey,
    );

    return allFulfilled;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    return false;
  }
};
