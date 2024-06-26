const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser } = require('../graphql');

const getLiquidationsHandler = async (
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

  try {
    const res = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
        method: 'GET',
      },
    );

    const liquidationAddressResult = await res.json();

    if (!liquidationAddressResult.count) {
      throw new Error('No liquidation addresses found for user');
    }

    const liquidationAddress = liquidationAddressResult.data[0];

    const drainsRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses/${liquidationAddress.id}/drains`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
        method: 'GET',
      },
    );

    const drainsResult = await drainsRes.json();

    return {
      success: true,
      drains: drainsResult.drains,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  getLiquidationsHandler,
};
