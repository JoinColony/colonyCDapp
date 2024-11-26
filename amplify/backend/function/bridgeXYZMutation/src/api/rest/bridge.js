const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const EnvVarsConfig = require('../../config/envVars.js');

const handleResponse = async (response, path) => {
  const responseJson = await response.json();

  if (!response.ok) {
    console.error(`Failed request to ${path}. Status: ${response.status}`);
    return {
      error: true,
      status: response.status,
      message: `Request failed: ${JSON.stringify(responseJson)}`,
      data: responseJson,
    };
  }

  return {
    error: false,
    status: response.status,
    data: responseJson,
  };
};

const handlePost = async (path, body = {}) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();

  const response = await fetch(`${apiUrl}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': uuid(),
      'Api-Key': apiKey,
    },
    body: JSON.stringify(body),
    method: 'POST',
  });

  return handleResponse(response, path);
};

const handlePut = async (path, body = {}) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();

  const response = await fetch(`${apiUrl}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify(body),
    method: 'PUT',
  });

  return handleResponse(response, path);
};

const handleGet = async (path, headers = {}) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();

  const response = await fetch(`${apiUrl}/${path}`, {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
  });

  return handleResponse(response, path);
};

const deleteExternalAccount = async (bridgeCustomerId, id) => {
  const { apiKey, apiUrl } = await EnvVarsConfig.getEnvVars();
  const response = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts/${id}`,
    {
      headers: {
        'Api-Key': apiKey,
      },
      method: 'DELETE',
    },
  );

  if (response.status !== 200) {
    console.log(`Error deleting external account: ${await response.text()}`);
  }
};

const createExternalAccount = async (bridgeCustomerId, account) => {
  const [firstName, lastName] = account.accountOwner.split(' ');
  const response = await handlePost(
    `v0/customers/${bridgeCustomerId}/external_accounts`,
    {
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
    },
  );

  if (response.status !== 201) {
    console.error(response.message);
    throw Error(`Error creating external account: ${response.message}`);
  }

  return response.data;
};

const createKYCLinks = async (fullName, email) => {
  const response = await handlePost(`v0/kyc_links`, {
    full_name: fullName,
    email,
    type: 'individual',
  });

  if (response.status !== 200) {
    console.log(`Could not generate new KYC links`);
  }

  return response.data;
};

const createLiquidationAddress = async (
  bridgeCustomerId,
  accountId,
  accountCurrency,
) => {
  const response = await handlePost(
    `v0/customers/${bridgeCustomerId}/liquidation_addresses`,
    {
      chain: 'arbitrum',
      currency: 'usdc',
      external_account_id: accountId,
      destination_payment_rail: accountCurrency === 'usd' ? 'ach' : 'sepa',
      destination_currency: accountCurrency,
    },
  );

  if (response.status !== 201) {
    console.error('Failed to create liquidation address');
    return null;
  }

  return response.data;
};

const getLiquidationAddresses = async (bridgeCustomerId) => {
  const response = await handleGet(
    `v0/customers/${bridgeCustomerId}/liquidation_addresses?limit=100`,
  );

  if (response.error) {
    console.error(response.message);
    throw new Error('Error fetching liquidation addresses');
  }

  return response.data.data;
};

const getExternalAccounts = async (bridgeCustomerId) => {
  const response = await handleGet(
    `v0/customers/${bridgeCustomerId}/external_accounts`,
  );

  if (response.error) {
    console.log(
      `Could not fetch external accounts for customer ${bridgeCustomerId}`,
    );
    return null;
  }

  return response.data.data;
};

const getBridgeCustomer = async (bridgeCustomerId) => {
  const response = await handleGet(`v0/customers/${bridgeCustomerId}`);
  return response.data;
};

const getGatewayFee = async () => {
  const response = await handleGet(`v0/developer/fees`);

  return response.data;
};

const getDrainsHistory = async (bridgeCustomerId, liquidationAddressId) => {
  const response = await handleGet(
    `v0/customers/${bridgeCustomerId}/liquidation_addresses/${liquidationAddressId}/drains`,
  );

  return response.data;
};

module.exports = {
  handlePost,
  handlePut,
  handleGet,
  createExternalAccount,
  deleteExternalAccount,
  createLiquidationAddress,
  createKYCLinks,
  getBridgeCustomer,
  getExternalAccounts,
  getLiquidationAddresses,
  getGatewayFee,
  getDrainsHistory,
};
