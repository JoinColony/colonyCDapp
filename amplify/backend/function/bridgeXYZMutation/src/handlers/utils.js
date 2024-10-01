const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const createExternalAccount = async (
  apiUrl,
  apiKey,
  bridgeCustomerId,
  account,
) => {
  const [firstName, lastName] = account.accountOwner.split(' ');

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
        first_name: firstName,
        last_name: lastName,
      }),
      method: 'POST',
    },
  );

  const createAccountJson = await createAccountRes.json();

  if (createAccountRes.status !== 201) {
    console.error(createAccountJson);
    throw Error('Error creating external account');
  }

  return createAccountJson;
};

const getLiquidationAddresses = async (apiUrl, apiKey, bridgeCustomerId) => {
  const liquidationAddressesRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    },
  );

  const liquidationAddressesJson = await liquidationAddressesRes.json();

  if (liquidationAddressesRes.status !== 200) {
    console.error(liquidationAddressesJson);
    throw new Error('Error fetching liquidation addresses');
  }

  return liquidationAddressesJson.data;
};

const getExternalAccounts = async (apiUrl, apiKey, bridgeCustomerId) => {
  const externalAccountsRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    },
  );

  if (externalAccountsRes.status !== 200) {
    console.log(`Could not fetch external accounts for customer ${bridgeCustomerId}`);
    return null;
  }

  const externalAccountsJson = await externalAccountsRes.json();

  return externalAccountsJson.data;
};

const deleteExternalAccount = async (apiUrl, apiKey, bridgeCustomerId, id) => {
  const deleteAccountRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts/${id}`,
    {
      headers: {
        'Api-Key': apiKey,
      },
      method: 'DELETE',
    },
  );

  if (deleteAccountRes.status !== 200) {
    console.log(
      `Error deleting external account: ${await deleteAccountRes.text()}`,
    );
  }
};

module.exports = {
  createExternalAccount,
  deleteExternalAccount,
  getExternalAccounts,
  getLiquidationAddresses,
};

