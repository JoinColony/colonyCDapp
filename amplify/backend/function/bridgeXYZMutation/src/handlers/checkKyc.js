const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUserByAddress } = require('../graphql');

const checkKYCHandler = async (
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

    // Get customer from Bridge

    const customerRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}`,
    );
    const bridgeCustomer = await customerRes.json();
    // Take email, name

    // "Generate" KYC links
    const kycLinksRes = await fetch(`${apiUrl}/v0/kyc_links`, {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': 'thisisadifferentkey',
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        full_name: bridgeCustomer.first_name + bridgeCustomer.last_name,
        email: bridgeCustomer.email,
        type: 'individual',
      }),
      method: 'POST',
    });

    const data = await kycLinksRes.json();
    console.log(data);

    // Take kyc link id
    const kycLinkId = data.id;

    // Check status of KYC Link id

    const res = await fetch(
      `${apiUrl}/${path.replace('{kycLinkID}', kycLinkId)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
      },
    );

    if (res.status !== 200) {
      throw Error(`Get failed with error code ${res.status}`);
    }
    const kyc_status = (await res.json()).kyc_status;

    // TODO: If KYC passed and external account added, generate liquidation address
    if (kyc_status === true) {
      // Do they have an external account?

      const externalAccountRes = await fetch(
        `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': 'thisisadifferentkey',
            'Api-Key': apiKey,
          },
        },
      );

      const externalAccounts = externalAccountRes.json();
      if (externalAccounts) {
      }
    }

    return {
      kyc_status,
      country: bridgeCustomer.address.country,
      success: true,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  checkKYCHandler,
};
