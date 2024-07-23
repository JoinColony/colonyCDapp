const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const createExternalAccount = async (
  apiUrl,
  apiKey,
  bridgeCustomerId,
  account,
) => {
  const createAccountRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        bank_name: account.bankName,
        currency: account.currency,
        account: account.usAccount,
        iban: account.iban,
        account_owner_type: 'individual',
        account_owner_name: account.accountOwner,
        account_type: account.currency === 'usd' ? 'us' : 'iban',
        address: account.address,
      }),
      method: 'POST',
    },
  );

  if (createAccountRes.status !== 201) {
    console.error(await createAccountRes.json());
    throw Error('Error creating external account');
  }
};

module.exports = {
  createExternalAccount,
};
