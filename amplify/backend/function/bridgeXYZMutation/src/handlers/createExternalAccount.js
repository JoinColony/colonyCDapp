const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser } = require('../graphql');

const createExternalAccountHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path } = event.arguments?.input || {};

  try {
    const { data: graphQlData } = await graphqlRequest(
      getUser,
      {
        id: checksummedWalletAddress,
      },
      graphqlURL,
      appSyncApiKey,
    );

    const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

    const res = await fetch(
      `${apiUrl}/${path.replace('{customerID}', bridgeCustomerId)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': uuid(),
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          ...body,
          account_owner_type: 'individual',
        }),
        method: 'POST',
      },
    );

    if (res.status !== 200) {
      throw Error(`POST failed with error code ${res.status}`);
    }

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  createExternalAccountHandler,
};
