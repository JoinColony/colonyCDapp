const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { updateUser } = require('../graphql');

const kycLinksHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path } = event.arguments?.input || {};

  try {
    const res = await fetch(`${apiUrl}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': 'thisisadifferentkey',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        ...body,
        type: 'individual',
      }),
      method: 'POST',
    });

    const data = await res.json();

    if (!data.customer_id) {
      throw new Error('No customer_id returned');
    } else {
      // Add customer_id to the user object
      const mutation = await graphqlRequest(
        updateUser,
        {
          input: {
            id: checksummedWalletAddress,
            bridgeCustomerId: data.customer_id,
          },
        },
        graphqlURL,
        appSyncApiKey,
      );

      if (mutation.errors || !mutation.data) {
        const [error] = mutation.errors;
        throw new Error(
          error?.message ||
            `Could not update user with wallet address "${checksummedWalletAddress}"`,
        );
      }

      // Return the two urls
      return {
        tos_link: data.tos_link,
        kyc_link: data.kyc_link,
      };
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  kycLinksHandler,
};
