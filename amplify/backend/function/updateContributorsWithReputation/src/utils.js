const { default: fetch, Request } = require('node-fetch');
const {
  createContributorWithReputation,
  updateContributorWithReputation,
} = require('./graphql');

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

const isWithinLastHour = (isoString) => {
  const oneHour = hoursToMilliseconds(1);
  const date = new Date(isoString).valueOf();
  return isWithinTimeFromNow(date, oneHour);
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

const createReputedContributorInDb = async ({
  colonyAddress,
  contributorAddress,
  nativeDomainId,
  domainReputationPercentage,
  colonyReputationPercentage,
  id,
  reputation,
  type,
  graphqlURL,
  apiKey,
}) => {
  const { errors } =
    (await graphqlRequest(
      createContributorWithReputation,
      {
        input: {
          colonyAddress,
          contributorAddress,
          domainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
          id,
          reputation,
          domainReputationPercentage,
          colonyReputationPercentage,
          type,
        },
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

const updateReputedContributorInDb = async ({
  id,
  reputation,
  domainReputationPercentage,
  colonyReputationPercentage,
  type,
  graphqlURL,
  apiKey,
}) => {
  // if exists, update existing contributor
  const { errors } =
    (await graphqlRequest(
      updateContributorWithReputation,
      {
        id,
        reputation,
        type,
        domainReputationPercentage,
        colonyReputationPercentage,
      },
      graphqlURL,
      apiKey,
    )) ?? {};

  if (errors) {
    throw new Error(errors[0].message);
  }
};

module.exports = {
  graphqlRequest,
  getContributorType,
  sortAddressesDescendingByReputation,
  createReputedContributorInDb,
  updateReputedContributorInDb,
  isWithinLastHour,
};
