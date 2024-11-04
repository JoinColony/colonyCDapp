const fetch = require('cross-fetch');

const {
  getTokenExchangeRate,
  saveTokenExchangeRate,
  getColonyActions,
  getColonyDomains,
  getDomainExpenditures,
  getColonyExpenditures,
  getColonyFundsClaims,
  getColonyTokens,
  getToken,
} = require('./schemas.js');

const EnvVarsConfig = require('../../config/envVars.js');

const { acceptedColonyActionTypes } = require('../../utils.js');

const graphqlRequest = async (queryOrMutation, variables) => {
  const { apiKey, graphqlURL } = await EnvVarsConfig.getEnvVars();
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
    const actionsData = await getData({ ...params, nextToken, limit: 1000 });
    nextToken = actionsData?.nextToken;
    if (actionsData?.items) {
      items.push(...actionsData.items);
    }
  } while (nextToken);

  return items;
};

const getDomains = async (colonyAddress) => {
  const result = await graphqlRequest(getColonyDomains, {
    colonyAddress,
  });

  return result.data.getDomainsByColony?.items;
};

const getColonyTokensData = async ({ colonyAddress, limit, nextToken }) => {
  const result = await graphqlRequest(getColonyTokens, {
    colonyAddress,
    limit,
    nextToken,
  });

  if (!result) {
    console.warn('Could not find any colony funds claims in db.');
  }

  return result.data.listColonyTokens;
};

const getAllColonyTokens = async (colonyAddress) => {
  return getAllPages(getColonyTokensData, { colonyAddress });
};

const getIncomingFundsData = async ({ colonyAddress, limit, nextToken }) => {
  const result = await graphqlRequest(getColonyFundsClaims, {
    colonyAddress,
    limit,
    nextToken,
  });

  if (!result) {
    console.warn('Could not find any colony funds claims in db.');
  }

  return result.data.getFundsClaimsByColony;
};

const getAllIncomingFunds = async (colonyAddress, domain) => {
  // Return [] if any domain other than root is selected
  if (domain && !domain.isRoot) {
    return [];
  }
  return getAllPages(getIncomingFundsData, { colonyAddress });
};

const getExpendituresData = async ({
  colonyAddress,
  nativeDomainId,
  limit,
  nextToken,
}) => {
  // If "All teams" filter is selected, fetch expenditures from all domains
  if (nativeDomainId === undefined) {
    const result = await graphqlRequest(getColonyExpenditures, {
      colonyAddress,
      limit,
      nextToken,
    });

    if (!result) {
      console.warn('Could not find any expenditures in db.');
    }

    return result.data.getExpendituresByColony;
  }

  const result = await graphqlRequest(getDomainExpenditures, {
    colonyAddress,
    nativeDomainId,
    limit,
    nextToken,
  });

  if (!result) {
    console.warn('Could not find any domain expenditures in db.');
  }

  return result.data.listExpenditures;
};

const getAllExpenditures = async (colonyAddress, domain) => {
  return getAllPages(getExpendituresData, {
    colonyAddress,
    nativeDomainId: domain?.nativeId,
  });
};

const getActionsData = async ({
  colonyAddress,
  domainId,
  nextToken,
  limit = 2,
}) => {
  const filter = {
    and: [
      {
        or: acceptedColonyActionTypes.map((acceptedColonyActionType) => ({
          type: { eq: acceptedColonyActionType },
        })),
      },
    ],
  };

  // If "All teams" filter is selected, do not filter by domainId
  if (domainId) {
    filter.and.push({
      or: [
        { fromDomainId: { eq: domainId } },
        { toDomainId: { eq: domainId } },
      ],
    });
  }

  const result = await graphqlRequest(getColonyActions, {
    colonyAddress,
    filter,
    limit,
    nextToken,
  });

  if (!result) {
    console.warn('Could not find any colony actions in db.');
  }

  return result.data.getActionsByColony;
};

const getAllActions = async (colonyAddress, domainId) => {
  return getAllPages(getActionsData, { colonyAddress, domainId });
};

const getTokensDecimalsFor = async (tokenAddresses) => {
  const tokenDecimals = {};

  const tokenResponses = await Promise.all(
    tokenAddresses.map((tokenAddress) =>
      graphqlRequest(getToken, {
        tokenAddress,
      }),
    ),
  );

  tokenResponses.forEach((tokenResponse) => {
    const { id, decimals } = tokenResponse?.data?.getToken || {};
    tokenDecimals[id] = decimals;
  });

  return tokenDecimals;
};

const saveExchangeRate = async ({ tokenId, date, marketPrice }) => {
  const result = await graphqlRequest(saveTokenExchangeRate, {
    input: {
      tokenId,
      date,
      marketPrice,
    },
  });

  return result.data.createTokenExchangeRate;
};

const getExchangeRate = async ({ tokenId, date }) => {
  const result = await graphqlRequest(getTokenExchangeRate, {
    tokenId,
    date,
  });

  return result.data?.tokenExhangeRateByTokenId?.items?.[0];
};

module.exports = {
  getAllIncomingFunds,
  getAllExpenditures,
  getAllActions,
  getDomains,
  saveExchangeRate,
  getExchangeRate,
  getTokensDecimalsFor,
  getAllColonyTokens,
};
