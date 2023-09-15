const { default: fetch, Request } = require('node-fetch');
const {
  createContributorReputation,
  updateContributorReputation,
  createColonyContributor,
  updateColonyContributor,
  updateDomain,
} = require('./graphql');
const Decimal = require('decimal.js');

const reputationMiningCycleMetadataId = 'REPUTATION_MINING_CYCLE_METADATA'; // this is constant, since we only need one entry of this type in the db.

const graphqlRequest = async (queryOrMutation, variables, url, authKey) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  const request = new Request(url, options);

  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    return body;
  } catch (error) {
    /*
     * Something went wrong... obviously
     */
    console.error(error);
    return null;
  }
};

const getDomainDatabaseId = (colonyAddress, nativeDomainId) => {
  return `${colonyAddress}_${nativeDomainId}`;
};

const contributorTypeMap = {
  20: 'TOP',
  40: 'DEDICATED',
  60: 'ACTIVE',
  GENERAL: 'GENERAL',
  NEW: 'NEW',
};

const sortAddressesDescendingByReputation = async (
  colonyClient,
  skillId,
  addresses,
) => {
  return (
    await Promise.all(
      addresses.map(async (address) => {
        const { reputationAmount } =
          await colonyClient.getReputationWithoutProofs(skillId, address);

        return {
          address,
          reputationBN: reputationAmount,
        };
      }),
    )
  ).sort((a, b) => {
    if (a.reputationBN.eq(b.reputationBN)) {
      return 0;
    }
    if (a.reputationBN.gt(b.reputationBN)) {
      return -1;
    }

    return 1;
  });
};

const isWithinTimeFromNow = (timeToTest, periodFromNow) => {
  const now = new Date().valueOf();

  return timeToTest >= now - periodFromNow;
};

const hoursToMilliseconds = (hours) => {
  return hours * 60 * 60 * 1000;
};

const daysToMilliseconds = (days) => days * hoursToMilliseconds(24);

const isWithinLast30Days = (isoString) => {
  const thirtyDays = daysToMilliseconds(30);
  const date = new Date(isoString).valueOf();
  return isWithinTimeFromNow(date, thirtyDays);
};

const getContributorType = (total, idx, createdAt) => {
  const top20Threshold = Math.floor(total * 0.2);
  const top40Threshold = Math.floor(total * 0.4);
  const top60Threshold = Math.floor(total * 0.6);

  if (total >= 5) {
    if (idx < top20Threshold) {
      return contributorTypeMap['20'];
    }
    if (idx < top40Threshold) {
      return contributorTypeMap['40'];
    }
    if (idx < top60Threshold) {
      return contributorTypeMap['60'];
    }

    if (isWithinLast30Days(createdAt)) {
      return contributorTypeMap.NEW;
    }

    return contributorTypeMap.GENERAL;
  }

  if (idx === 0) {
    return contributorTypeMap['20'];
  }
  if (idx === 1) {
    return contributorTypeMap['40'];
  }
  if (idx === 2) {
    return contributorTypeMap['60'];
  }

  if (isWithinLast30Days(createdAt)) {
    return contributorTypeMap.NEW;
  }

  return contributorTypeMap.GENERAL;
};

const createContributorReputationInDb = async ({
  colonyAddress,
  contributorAddress,
  nativeDomainId,
  reputationPercentage,
  id,
  reputationRaw,
  graphqlURL,
  apiKey,
}) => {
  const { errors } =
    (await graphqlRequest(
      createContributorReputation,
      {
        input: {
          colonyAddress,
          contributorAddress,
          domainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
          id,
          reputationRaw,
          reputationPercentage,
        },
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

const updateContributorReputationInDb = async ({
  id,
  reputationRaw,
  reputationPercentage,
  graphqlURL,
  apiKey,
}) => {
  const { errors } =
    (await graphqlRequest(
      updateContributorReputation,
      {
        input: {
          id,
          reputationRaw,
          reputationPercentage,
        },
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

const updateColonyContributorInDb = async ({
  id,
  type,
  colonyReputationPercentage,
  graphqlURL,
  apiKey,
}) => {
  const { errors } =
    (await graphqlRequest(
      updateColonyContributor,
      {
        input: {
          id,
          type,
          colonyReputationPercentage,
          hasReputation: colonyReputationPercentage > 0,
        },
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

const createColonyContributorInDb = async ({
  id,
  contributorAddress,
  type,
  colonyAddress,
  colonyReputationPercentage,
  graphqlURL,
  apiKey,
}) => {
  const { errors } =
    (await graphqlRequest(
      createColonyContributor,
      {
        input: {
          id,
          contributorAddress,
          isVerified: false,
          type,
          colonyAddress,
          colonyReputationPercentage,
          hasReputation: colonyReputationPercentage > 0,
        },
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

const updateReputationInDomain = async ({
  databaseDomainId,
  reputation,
  colonyReputation,
  graphqlURL,
  apiKey,
}) => {
  const reputationPercentage = new Decimal(reputation)
    .mul(100)
    .div(colonyReputation)
    .toString();

  return graphqlRequest(
    updateDomain,
    {
      input: {
        id: databaseDomainId,
        reputation,
        reputationPercentage,
      },
    },
    graphqlURL,
    apiKey,
  );
};

module.exports = {
  graphqlRequest,
  getContributorType,
  sortAddressesDescendingByReputation,
  updateContributorReputationInDb,
  createColonyContributorInDb,
  createContributorReputationInDb,
  updateColonyContributorInDb,
  updateReputationInDomain,
  getDomainDatabaseId,
  reputationMiningCycleMetadataId,
};
