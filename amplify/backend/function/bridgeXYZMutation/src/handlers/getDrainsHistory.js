const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
const { getUser } = require('../graphql');
const { getLiquidationAddresses } = require('./utils');

const getDrainsHistoryHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  const { data: graphQlData } = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );
  const colonyUser = graphQlData?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;

  const liquidationAddresses = await getLiquidationAddresses(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );

  if (!liquidationAddresses.length) {
    return [];
  }

  const liquidationAddressIds = liquidationAddresses.map((item) => item.id);

  const drains = [];

  for (const liquidationAddressId of liquidationAddressIds) {
    const drainsRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses/${liquidationAddressId}/drains`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        method: 'GET',
      },
    );

    const drainsResult = await drainsRes.json();

    const mappedDrains = drainsResult.data.map((drain) => ({
      id: drain.id,
      amount: drain.amount,
      currency: drain.currency,
      state: drain.state,
      createdAt: drain.created_at,
      receipt: drain.receipt
        ? {
            url: drain.receipt.url,
          }
        : null,
    }));

    drains.push(...mappedDrains);
  }

  return drains;
};

module.exports = {
  getDrainsHistoryHandler,
};
