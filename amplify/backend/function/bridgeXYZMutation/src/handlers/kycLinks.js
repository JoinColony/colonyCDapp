const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { updateUser } = require('../graphql');

/**
 * Extracts customer_id from TOS links of the following format:
 * https://dashboard.bridge.xyz/accept-terms-of-service?customer_id=xxx
 * @param tosLink {string}
 */
const extractCustomerId = (tosLink) => {
  try {
    const url = new URL(tosLink);
    return url.searchParams.get('customer_id') ?? null;
  } catch {
    return null;
  }
};

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
        'Idempotency-Key': uuid(),
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        ...body,
        type: 'individual',
      }),
      method: 'POST',
    });

    const data = await res.json();

    /**
     * customer_id in the kyc link object will be null until both TOS/KYC approved
     * We can however extract the customer ID from the TOS link
     */
    const tosLink = data?.tos_link ?? data?.existing_kyc_link?.tos_link;
    if (!tosLink) {
      throw new Error('TOS link missing from Bridge XYZ response');
    }

    const customerId = extractCustomerId(tosLink);
    if (!customerId) {
      throw new Error('Could not extract customer ID from TOS link');
    }

    // Add customer_id to the user object
    const mutation = await graphqlRequest(
      updateUser,
      {
        input: {
          id: checksummedWalletAddress,
          bridgeCustomerId: customerId,
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
      tos_link: data?.tos_link || data?.existing_kyc_link?.tos_link,
      kyc_link: data?.kyc_link || data?.existing_kyc_link?.kyc_link,
      success: true,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  kycLinksHandler,
};
