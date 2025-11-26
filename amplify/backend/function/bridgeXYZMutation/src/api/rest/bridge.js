const fetch = require('cross-fetch');
const { v4: uuid } = require('uuid');

const EnvVarsConfig = require('../../config/envVars.js');

const {
  bridgeApiConfig,
  USDC_TOKEN_NAME,
  CHAIN_SHORT_NAME,
} = require('../../consts.js');

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
    `${apiUrl}/${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.externalAccounts}/${id}`,
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
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.externalAccounts}`,
    {
      bank_name: account.bankName,
      currency: account.currency,
      account: account.usAccount,
      iban: account.iban,
      account_owner_type: bridgeApiConfig.constants.accountOwnerType,
      account_owner_name: account.accountOwner,
      account_type:
        account.currency === 'usd'
          ? bridgeApiConfig.constants.accountType.US
          : bridgeApiConfig.constants.accountType.IBAN,
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
  const response = await handlePost(
    `${bridgeApiConfig.endpoints.routes.kycLinks}`,
    {
      full_name: fullName,
      email,
      type: bridgeApiConfig.constants.accountOwnerType,
    },
  );

  if (response.status !== 200 && !response.data.existing_kyc_link) {
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
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.liquidationAddresses}`,
    {
      chain: CHAIN_SHORT_NAME,
      currency: USDC_TOKEN_NAME,
      external_account_id: accountId,
      destination_payment_rail:
        accountCurrency === 'usd'
          ? bridgeApiConfig.constants.paymentRail.ACH
          : bridgeApiConfig.constants.paymentRail.SEPA,
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
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.liquidationAddresses}?limit=100`,
  );

  if (response.error) {
    console.error(response.message);
    throw new Error('Error fetching liquidation addresses');
  }

  return response.data.data;
};

const getLiquidationAddressForExternalAccount = async (
  bridgeCustomerId,
  externalAccountId,
) => {
  const liquidationAddresses = await getLiquidationAddresses(bridgeCustomerId);

  return (
    liquidationAddresses.find(
      (address) =>
        address.external_account_id === externalAccountId &&
        address.state === 'active',
    )?.address ?? null
  );
};

const getExternalAccounts = async (bridgeCustomerId) => {
  const response = await handleGet(
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.externalAccounts}`,
  );

  if (response.error) {
    console.log(
      `Could not fetch external accounts for customer ${bridgeCustomerId}`,
    );
    return null;
  }

  const activeAccounts = response.data.data.filter((a) => a.active === true);

  return activeAccounts;
};

const getBridgeCustomer = async (bridgeCustomerId) => {
  const response = await handleGet(
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}`,
  );
  return response.data;
};

const getGatewayFee = async () => {
  const response = await handleGet(
    `${bridgeApiConfig.endpoints.routes.developer}/${bridgeApiConfig.endpoints.resources.fees}`,
  );

  return response.data;
};

const getDrainsHistory = async (bridgeCustomerId, liquidationAddressId) => {
  const response = await handleGet(
    `${bridgeApiConfig.endpoints.routes.customers}/${bridgeCustomerId}/${bridgeApiConfig.endpoints.resources.liquidationAddresses}/${liquidationAddressId}/${bridgeApiConfig.endpoints.resources.drains}`,
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
  getLiquidationAddressForExternalAccount,
};
