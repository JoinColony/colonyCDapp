const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUserByAddress } = require('../graphql');

const putCustomerHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path } = event.arguments?.input || {};

  try {
    const { data: graphQlData } = await graphqlRequest(
      getUserByAddress,
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
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          ...body,
          type: 'individual',
        }),
        method: 'PUT',
      },
    );

    if (res.status !== 200) {
      console.log(await res.json());
      throw Error(
        `Put failed with error code ${res.status}. Error message was: ${await res.json()}`,
      );
    }

    return { success: true };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  putCustomerHandler,
};
