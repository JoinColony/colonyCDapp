const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
const { getLiquidationAddresses } = require('./utils');

const { getUser } = require('../graphql');

const getUserLiquidationAddressHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const userAddress = event.arguments.userAddress;

  const { data: graphQlData } = await graphqlRequest(
    getUser,
    {
      id: userAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );
  const colonyUser = graphQlData?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;
  if (!bridgeCustomerId) {
    return null;
  }

  const externalAccountRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    },
  );

  const response = await externalAccountRes.json();

  const externalAccounts = response.data;
  const firstAccount = externalAccounts?.[0];

  if (!firstAccount) {
    return null;
  }

  const liquidationAddresses = await getLiquidationAddresses(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );

  const relevantLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === firstAccount.id,
  )?.address;

  return relevantLiquidationAddress;
};

module.exports = {
  getUserLiquidationAddressHandler,
};
