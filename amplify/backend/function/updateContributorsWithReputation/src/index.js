const { getColonyNetworkClient, Network, Id } = require('@colony/colony-js');
const {
  providers,
  constants: { AddressZero },
  utils: { Logger, getAddress },
} = require('ethers');
const Decimal = require('decimal.js');

const {
  getContributorWithReputation,
  getColony,
  updateColony,
} = require('./graphql');

const {
  graphqlRequest,
  getContributorType,
  sortAddressesDescendingByReputation,
  createReputedContributorInDb,
  updateReputedContributorInDb,
  isWithinLastHour,
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
      // may error if there's no rep in colony. In that case, there are no reputed contributors to update.
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

    const lastUpdatedCache =
      data?.getColony?.lastUpdatedContributorsWithReputation;

    // If we updated the cache within the last hour, we don't need to update it again
    // Note the decision to choose one hour is arbitrary and based on the idea that the reputation mining
    // cycle takes between 1-2 hours. But if we want fresher data, we can reduce this number.
    // In dev we can just call this function every time
    if (
      process.env.ENV !== 'dev' &&
      lastUpdatedCache &&
      isWithinLastHour(lastUpdatedCache)
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

        // For each domain, sort addresses by reputation, get the contributor type, and
        // update the database with the corresponding ReputedContributor entry
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
              .toString();

            const domainReputationPercentage = contributorRepDecimal
              .mul(100)
              .div(totalRepInDomain.toString())
              .toString();

            const id = `${colonyAddress}_${nativeDomainId}_${contributorAddress}`;
            const reputation = reputationBN.toString();

            const { data: response } =
              (await graphqlRequest(
                getContributorWithReputation,
                { id },
                graphqlURL,
                apiKey,
              )) ?? {};

            if (response?.getContributorWithReputation) {
              const { createdAt } = response.getContributorWithReputation;
              const type =
                nativeDomainId === Id.RootDomain
                  ? getContributorType(totalAddresses, idx, createdAt)
                  : null;

              await updateReputedContributorInDb({
                id,
                reputation,
                domainReputationPercentage,
                colonyReputationPercentage,
                type,
                graphqlURL,
                apiKey,
              });
            } else {
              const type = Id.RootDomain
                ? getContributorType(
                    totalAddresses,
                    idx,
                    new Date().toISOString(),
                  )
                : null;
              await createReputedContributorInDb({
                colonyAddress,
                contributorAddress,
                nativeDomainId,
                id,
                reputation,
                domainReputationPercentage,
                colonyReputationPercentage,
                type,
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
      { colonyAddress, date: new Date().toISOString() },
      graphqlURL,
      apiKey,
    );

    return allFulfilled;
  } catch (e) {
    console.error(e);
    return false;
  }
};
