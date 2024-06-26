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
    const colonyUser = graphQlData?.getUser;

    const bridgeCustomerId = colonyUser?.bridgeCustomerId;

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

    // Is it an existing KYC link or a new one?
    let kycLink;
    let kycLinkId;
    if (data.existing_kyc_link) {
      kycLinkId = data.existing_kyc_link.id;
      kycLink = data.existing_kyc_link.kyc_link;
    } else {
      kycLinkId = data.id;
      kycLink = data.kyc_link;
    }

    // Take kyc link id
    // const kycLinkId = data.id;
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

    // TODO: If ~~KYC passed and~~ external account added, generate liquidation address

    const externalAccountRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
      },
    );

    const externalAccounts = await externalAccountRes.json();

    // TODO: Support multiple accounts
    const firstAccount = externalAccounts[0];
    const mappedAccount = firstAccount
      ? {
          id: firstAccount.id,
          currency: firstAccount.currency,
          bankName: firstAccount.bank_name,
          iban: firstAccount.iban
            ? {
                last4: firstAccount.iban.last4,
                bic: firstAccount.iban.bic,
                country: firstAccount.iban.country,
              }
            : null,
          usAccount: firstAccount.account
            ? {
                last4: firstAccount.account.last4,
                routingNumber: firstAccount.account.routing_number,
              }
            : null,
        }
      : null;

    const hasLiquidationAddress =
      colonyUser.liquidationAddresses.items.length > 0;

    if (firstAccount && !hasLiquidationAddress) {
      // Create liquidation address
      console.log('need to create');
    }

    return {
      kyc_status,
      kyc_link: kycLink,
      country: bridgeCustomer.address.country,
      success: true,
      bankAccount: mappedAccount,
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  checkKYCHandler,
};
