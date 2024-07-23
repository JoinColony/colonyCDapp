const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser } = require('../graphql');

const putCustomerHandler = async (
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
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
          address: body.address,
          birth_date: body.birth_date,
          tax_identification_number: body.tax_identification_number,
          signed_agreement_id: body.signed_agreement_id,
          type: 'individual',
        }),
        method: 'PUT',
      },
    );

    if (res.status !== 200) {
      // We might want not to expose the error message to the client
      const message = JSON.stringify(await res.json());
      throw Error(
        `Put failed with error code ${res.status}. Error message was: ${message}`,
      );
    }

    // Create external account
    const accountType = body.currency === 'eur' ? 'iban' : 'us';

    const createAccountPayload = {
      currency: body.currency,
      bank_name: body.bank_name,
      account_owner_name: `${body.first_name} ${body.last_name}`,
      account_type: accountType,
      iban: body.iban,
      account: body.account,
      account_owner_type: 'individual',
      first_name: body.first_name,
      last_name: body.last_name,
      address: body.address,
    };

    const externalAccountRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': uuid(),
          'Api-Key': apiKey,
        },
        body: JSON.stringify(createAccountPayload),
        method: 'POST',
      },
    );

    if (externalAccountRes.status !== 200) {
      // We might want not to expose the error message to the client
      const message = JSON.stringify(await externalAccountRes.json());
      throw Error(
        `Failed to create bank account with error code ${externalAccountRes.status}. Error message was: ${message}`,
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
