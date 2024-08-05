const fetch = require('cross-fetch');

const {
  getTokenExchangeRate,
  saveTokenExchangeRate,
  getColonyActions,
  getColonyDomains,
  getDomainExpenditures,
  getColonyFundsClaims
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
}

const getDomains = async (colonyAddress) => {

  const result = await graphqlRequest(getColonyDomains, {
    colonyAddress
  });

  return result.data.listDomains?.items;
}

const getIncomingFundsData = async ({
  colonyAddress, limit, nextToken
}) => {
  const result = await graphqlRequest(getColonyFundsClaims, {
    colonyAddress,
    limit,
    nextToken
  });

  if (!result) {
    console.warn(
      'Could not find any colony funds claims in db.',
    );
  }

  return result.data.listColonyFundsClaims;
};

const getAllIncomingFunds = async (colonyAddress, domain) => {
  if (!domain?.isRoot) {
    return []
  }
  return getAllPages(getIncomingFundsData, { colonyAddress })
};

const getExpendituresData = async ({
  nativeDomainId, limit, nextToken
}) => {
  const result = await graphqlRequest(getDomainExpenditures, {
    nativeDomainId,
    limit,
    nextToken
  });

  if (!result) {
    console.warn(
      'Could not find any domain expenditure in db.',
    );
  }

  return result.data.listExpenditures;
};

const getAllExpenditures = async (domain) => {
  if (!domain?.nativeId) {
    return []
  }
  return getAllPages(getExpendituresData, { nativeDomainId: domain?.nativeId })
};

const acceptedColonyActionTypes = [
  "PAYMENT", "PAYMENT_MOTION", 
  "MOVE_FUNDS", "MOVE_FUNDS_MOTION"
];

const getActionsData = async ({
  colonyAddress, domainAddress, nextToken, limit = 2
}) => {
  const result = await graphqlRequest(getColonyActions, {
    colonyAddress,
    filter: {
      and: [{
        or: [{ fromDomainId: { eq: domainAddress } }, { toDomainId: { eq: domainAddress } }]
      }, {
        or: acceptedColonyActionTypes.map(acceptedColonyActionType => ({ type: { eq: acceptedColonyActionType } }))
      }, {
        showInActionsList: { eq: true }
      }
      ]
    },
    limit,
    nextToken
  });

  if (!result) {
    console.warn(
      'Could not find any colony actions in db.',
    );
  }

  return result.data.getActionsByColony;
}

const getAllActions = async (colonyAddress, domainAddress) => {
  return getAllPages(getActionsData, { colonyAddress, domainAddress })
}

const saveExchangeRate = async ({ tokenId, date, marketPrice }) => {

  const result = await graphqlRequest(saveTokenExchangeRate, {
    input: {
      tokenId,
      date,
      marketPrice,
    }
  });

  return result.data.createTokenExchangeRate;

}

const getExchangeRate = async ({ tokenId, date }) => {

  const result = await graphqlRequest(getTokenExchangeRate, {
    tokenId,
    date,
  });

  return result.data?.tokenExhangeRateByTokenId?.items?.[0];
}

module.exports = {
  getAllIncomingFunds,
  getAllExpenditures,
  getAllActions,
  getDomains,
  saveExchangeRate,
  getExchangeRate,
};