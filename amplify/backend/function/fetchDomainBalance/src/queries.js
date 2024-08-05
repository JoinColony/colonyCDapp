const fetch = require('cross-fetch');
const {
  Network,
} = require('@colony/colony-js');

const {
  getTokenExchangeRate,
  saveTokenExchangeRate,
  getColonyActions,
  getColonyBalance,
  getColonyDomains,
} = require('./graphql.js');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let reputationOracleEndpoint =
    'http://reputation-monitor:3001/reputation/local';
let networkAddress;
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

const graphqlRequest = async (queryOrMutation, variables) => {
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

// CREATE_EXPENDITURE from existing query; showInActionList - to know a motion has been executed - executedAt
const acceptedColonyActionTypes = ["PAYMENT", "PAYMENT_MOTION", "MOVE_FUNDS", "MOVE_FUNDS_MOTION"];

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
  let items = [];
  let nextToken = null;

  do {
    const actionsData = await getActionsData({ colonyAddress, domainAddress, nextToken });
    nextToken = actionsData.nextToken;
    items.push(...actionsData.items);

  } while (nextToken);

  return items;
}


const getBalance = async (colonyAddress) => {
  
  const result = await graphqlRequest(getColonyBalance, {
    colonyAddress
  });

  return result.data.getColonyByAddress?.items?.[0]?.balances?.items;
}

const getDomains = async (colonyAddress) => {

  const result = await graphqlRequest(getColonyDomains, {
    colonyAddress
  });

  return result.data.listDomains?.items;
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
  DEFAULT_NETWORK: network,
  setEnvVariables,
  getAllActions,
  saveExchangeRate,
  getExchangeRate,
  getBalance,
  getDomains,
};