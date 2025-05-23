require('cross-fetch/polyfill');
const {
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
  repMinerRequest,
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
  loggingFnFactory,
} = require('./utils');

Logger.setLogLevel(Logger.levels.ERROR);

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let reputationOracleEndpoint =
  'http://reputation-monitor:3001/reputation/local';
let log = loggingFnFactory();

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, reputationOracleEndpoint] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'reputationEndpoint',
    ]);
    log = loggingFnFactory(ENV);
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

    log(`Colony ${colonyAddress} reputation update started`);

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

    const { currentRootHash } = await repMinerRequest(
      `${reputationOracleEndpoint}/rootHashes`,
    );

    let totalRepInColony;
    try {
      ({ reputationAmount: totalRepInColony } = await repMinerRequest(`
          ${reputationOracleEndpoint}/${currentRootHash}/${colonyAddress}/${rootDomain.nativeSkillId}/${AddressZero}/noProof
        `));
    } catch (e) {
      console.error('Could not get total reputation in colony', e);
      // may error if there's no rep in colony. In that case, there are no contributors to update.
      return true;
    }

    log({ totalRepInColony: totalRepInColony?.toString() || '0' });

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

    log({
      lastUpdatedCache,
      lastReputationMiningCycleCompletion,
      willUpdateCache: !(
        new Date(lastReputationMiningCycleCompletion).valueOf() <
        new Date(lastUpdatedCache).valueOf()
      ),
    });

    // We only need to update the cache if the reputation mining cycle has completed since the last time we updated the cache
    /*
     * @NOTE This could be improved by checking the current root hash against a pre-stored value eliminating the need for the ingestor
     * In theory. In practice we still need the ingestor to UI visual updates on "how much time 'till the reputation updates"
     * And since we already store all those values, changing this becomes a bit pointless
     */
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
          ({ addresses } = await await repMinerRequest(
            `${reputationOracleEndpoint}/${currentRootHash}/${colonyAddress}/${skillId}`,
          ));
          ({ reputationAmount: totalRepInDomain } = await repMinerRequest(
            `${reputationOracleEndpoint}/${currentRootHash}/${colonyAddress}/${skillId}/${AddressZero}/noProof`,
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
          reputation: totalRepInDomain?.toString() || '0',
          colonyReputation: totalRepInColony?.toString() || '0',
        });

        // For each domain, sort addresses by reputation, get the contributor type, and
        // update the database with the corresponding Contributor entry

        // This will take a long time depending on how many reputation holders there are
        const sortedAddresses = await sortAddressesDescendingByReputation(
          reputationOracleEndpoint,
          currentRootHash,
          colonyAddress,
          skillId,
          addresses,
        );

        const totalAddresses = sortedAddresses.length;

        log({
          nativeId,
          nativeSkillId,
          totalRepInDomain: totalRepInDomain?.toString() || '0',
          addressesWithReputation: JSON.stringify(
            sortedAddresses.map(({ address, reputationBN }) => ({
              address,
              reputationBN: reputationBN?.toString() || '0',
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
            const reputation = reputationBN?.toString() || '0';

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
        log(
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
          reputation: totalRepInColony?.toString() || '0',
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
