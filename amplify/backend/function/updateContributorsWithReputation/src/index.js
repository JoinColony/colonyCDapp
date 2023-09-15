const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
const {
  providers,
  constants: { AddressZero },
  utils: { Logger, getAddress },
} = require('ethers');
const Decimal = require('decimal.js');

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
} = require('./utils');

Logger.setLogLevel(Logger.levels.ERROR);

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
let networkAddress;
let reputationOracleEndpoint =
  'http://reputation-monitor.docker:3001/reputation/local';
let network = Network.Custom;

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

    const provider = new providers.JsonRpcProvider(rpcURL);

    const networkClient = getColonyNetworkClient(network, provider, {
      networkAddress,
      reputationOracleEndpoint,
    });

    const colonyClient = await networkClient.getColonyClient(colonyAddress);
    const { skillId: rootSkillId } = await colonyClient.getDomain(
      Id.RootDomain,
    );

    let totalRepInColony;
    try {
      ({ reputationAmount: totalRepInColony } =
        await colonyClient.getReputationWithoutProofs(
          rootSkillId,
          AddressZero,
        ));
    } catch (e) {
      // may error if there's no rep in colony. In that case, there are no contributors to update.
      return true;
    }

    // query all domains

    const { data } =
      (await graphqlRequest(
        getColony,
        { colonyAddress },
        graphqlURL,
        apiKey,
      )) ?? {};

    const { data: response } =
      (await graphqlRequest(
        getReputationMiningCycleMetadata,
        { id: reputationMiningCycleMetadataId },
        graphqlURL,
        apiKey,
      )) ?? {};

    const lastUpdatedCache =
      data?.getColony?.lastUpdatedContributorsWithReputation;

    const lastReputationMiningCycleCompletion =
      response?.getReputationMiningCycleMetadata?.lastCompletedAt;

    // We only need to update the cache if the reputation mining cycle has completed since the last time we updated the cache
    if (
      new Date(lastReputationMiningCycleCompletion).valueOf() <
      new Date(lastUpdatedCache).valueOf()
    ) {
      return true;
    }

    const allNativeDomainIds =
      data?.getColony?.domains?.items?.map(({ nativeId }) => nativeId) ?? [];

    const promiseResults = await Promise.allSettled(
      allNativeDomainIds.map(async (nativeDomainId) => {
        const { skillId } = await colonyClient.getDomain(nativeDomainId);
        let addresses;
        let totalRepInDomain;

        try {
          ({ addresses } = await colonyClient.getMembersReputation(skillId));
          ({ reputationAmount: totalRepInDomain } =
            await colonyClient.getReputationWithoutProofs(
              skillId,
              AddressZero,
            ));
        } catch {
          // can error if no rep in domain. skip in this case.
          return;
        }

        // update total rep in domain in db
        await updateReputationInDomain({
          databaseDomainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
          apiKey,
          graphqlURL,
          reputation: totalRepInDomain.toString(),
          colonyReputation: totalRepInColony.toString(),
        });

        // For each domain, sort addresses by reputation, get the contributor type, and
        // update the database with the corresponding Contributor entry

        const sortedAddresses = await sortAddressesDescendingByReputation(
          colonyClient,
          skillId,
          addresses,
        );

        const totalAddresses = sortedAddresses.length;

        const promiseStatuses = await Promise.allSettled(
          sortedAddresses.map(async ({ address, reputationBN }, idx) => {
            const contributorAddress = getAddress(address);
            const contributorRepDecimal = new Decimal(reputationBN.toString());

            const colonyReputationPercentage = contributorRepDecimal
              .mul(100)
              .div(totalRepInColony.toString())
              .toNumber();

            const domainReputationPercentage = contributorRepDecimal
              .mul(100)
              .div(totalRepInDomain.toString())
              .toNumber();

            const contributorReputationId = `${colonyAddress}_${nativeDomainId}_${contributorAddress}`;
            const colonyContributorId = `${colonyAddress}_${contributorAddress}`;
            const reputation = reputationBN.toString();
            const isRootDomain = nativeDomainId === Id.RootDomain;

            const { data: repResponse } =
              (await graphqlRequest(
                getContributorReputation,
                { id: contributorReputationId },
                graphqlURL,
                apiKey,
              )) ?? {};

            // If root domain, check if we have a contributor entry
            if (isRootDomain) {
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
                nativeDomainId,
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
        console.error(reason);
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
    console.error(e);
    return false;
  }
};
