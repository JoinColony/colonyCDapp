const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const EnvVarsConfig = require('../../config/envVars.js');

const createExternalAccount = async (bridgeCustomerId, account) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
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

const getLiquidationAddresses = async (bridgeCustomerId) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
  const liquidationAddressesRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses?limit=100`,
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

const getExternalAccounts = async (bridgeCustomerId) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
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
    console.log(
      `Could not fetch external accounts for customer ${bridgeCustomerId}`,
    );
    return null;
  }

  const externalAccountsJson = await externalAccountsRes.json();

  return externalAccountsJson.data;
};

const deleteExternalAccount = async (bridgeCustomerId, id) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
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

const getBridgeCustomer = async (bridgeCustomerId) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
  const customerRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}`,
    {
      headers: {
        'Api-Key': apiKey,
      },
    },
  );
  return customerRes.json();
};

const getKYCLinks = async (fullName, email) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
  const kycLinksRes = await fetch(`${apiUrl}/v0/kyc_links`, {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': uuid(),
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      full_name: fullName,
      email,
      type: 'individual',
    }),
    method: 'POST',
  });

  const kycLinksJson = await kycLinksRes.json();

  if (kycLinksRes.status !== 200) {
    console.log(`Could not generate KYC links`);
  }

  return kycLinksJson;
};

const createLiquidationAddress = async (
  bridgeCustomerId,
  accountId,
  accountCurrency,
) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
  const liquidationAddressCreation = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
        'Api-Key': apiKey,
      },
      method: 'POST',
      body: JSON.stringify({
        chain: 'arbitrum',
        currency: 'usdc',
        external_account_id: accountId,
        destination_payment_rail: accountCurrency === 'usd' ? 'ach' : 'sepa',
        destination_currency: accountCurrency,
      }),
    },
  );

  const liquidationAddressCreationJson =
    await liquidationAddressCreation.json();

  if (liquidationAddressCreation.status !== 201) {
    console.error(
      'Failed to create liquidation address: ',
      liquidationAddressCreationJson,
    );
    return null;
  }

  return liquidationAddressCreationJson;
};

const getGatewayFee = async () => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();

  const res = await fetch(`${apiUrl}/v0/developer/fees`, {
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
  });

  return res.json();
};

const getDrainsHistory = async (bridgeCustomerId, liquidationAddressId) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();

  const drainsRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses/${liquidationAddressId}/drains`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      method: 'GET',
    },
  );

  return drainsRes.json();
};

module.exports = {
  createExternalAccount,
  deleteExternalAccount,
  createLiquidationAddress,
  getBridgeCustomer,
  getExternalAccounts,
  getLiquidationAddresses,
  getKYCLinks,
  getGatewayFee,
  getDrainsHistory,
};
