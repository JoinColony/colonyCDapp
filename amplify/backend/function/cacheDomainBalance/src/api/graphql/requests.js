const fetch = require('cross-fetch');

const {
  getColonies,
  getColonyDomains,
  getDomainBalance,
  getCachedTotalBalance,
  saveCacheTotalBalance,
  updateCacheTotalBalance,
} = require('./schemas.js');

const EnvVarsSetupFactory = require('../../config/envVars.js');

const graphqlRequest = async (queryOrMutation, variables) => {
  const { apiKey, graphqlURL } = await EnvVarsSetupFactory.getEnvVars();
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  let body;
  let response;

  try {
    response = await fetch(graphqlURL, options);
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

const getAllPages = async (getData, params) => {
  let items = [];
  let nextToken = null;

  do {
    const actionsData = await getData({ ...params, nextToken });
    nextToken = actionsData.nextToken;
    items.push(...actionsData.items);
  } while (nextToken);

  return items;
};

const getDomains = async (colonyAddress) => {
  const result = await graphqlRequest(getColonyDomains, {
    colonyAddress,
  });

  return result.data.getDomainsByColony?.items;
};

const getColoniesData = async ({ limit, nextToken }) => {
  const result = await graphqlRequest(getColonies, {
    limit,
    nextToken,
  });

  if (!result) {
    console.warn('Could not find any colonies in db.');
  }

  return result.data.listColonies;
};

const getAllColonies = async () => {
  return getAllPages(getColoniesData);
};

const computePreviousBalance = async ({
  colonyAddress,
  domainId,
  timeframePeriod,
  timeframeType,
  timeframePeriodEndDate,
}) => {
  const result = await graphqlRequest(getDomainBalance, {
    colonyAddress,
    domainId,
    timeframePeriod,
    timeframeType,
    timeframePeriodEndDate,
  });

  return result.data.getDomainBalance;
};

const getPreviousBalance = async ({
  colonyAddress,
  domainId,
  timeframePeriod,
  timeframeType,
}) => {
  const result = await graphqlRequest(getCachedTotalBalance, {
    colonyAddress,
    domainId,
    filter: {
      timeframePeriod: {
        eq: timeframePeriod,
      },
      timeframeType: {
        eq: timeframeType,
      },
    },
  });

  return result.data.cacheTotalBalanceByColonyAddress?.items?.[0];
};

const savePreviousBalance = async ({
  colonyAddress,
  domainId,
  timeframePeriod,
  timeframeType,
  totalIn,
  totalOut,
  date,
}) => {
  const result = await graphqlRequest(saveCacheTotalBalance, {
    input: {
      colonyAddress,
      domainId,
      timeframePeriod,
      timeframeType,
      totalIn,
      totalOut,
      date,
    },
  });

  return result.data.cacheTotalBalanceByColonyAddress;
};

const updatePreviousBalance = async ({
  id,
  colonyAddress,
  domainId,
  timeframePeriod,
  timeframeType,
  totalIn,
  totalOut,
  date,
}) => {
  const result = await graphqlRequest(updateCacheTotalBalance, {
    input: {
      id,
      colonyAddress,
      domainId,
      timeframePeriod,
      timeframeType,
      totalIn,
      totalOut,
      date,
    },
  });

  return result.data.cacheTotalBalanceByColonyAddress;
};

module.exports = {
  getDomains,
  getAllColonies,
  computePreviousBalance,
  getPreviousBalance,
  savePreviousBalance,
  updatePreviousBalance,
};
