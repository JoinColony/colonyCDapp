const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
const { createExternalAccount, getLiquidationAddresses } = require('./utils');

const { getUser } = require('../graphql');

const updateExternalAccountHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const input = event.arguments.input;
  const account = input.account;

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  if (!account.iban && !account.usAccount) {
    throw new Error('Account details must be provided');
  }

  if (account.currency === 'usd' && !account.address) {
    throw new Error('Address must be provided for US accounts');
  }

  const { data: graphQlData } = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

  const deleteAccountRes = await fetch(
    `${apiUrl}/v0/customers/${bridgeCustomerId}/external_accounts/${input.id}`,
    {
      headers: {
        'Api-Key': apiKey,
      },
      method: 'DELETE',
    },
  );

  if (deleteAccountRes.status !== 200) {
    console.error(await deleteAccountRes.json());
    throw Error('Error deleting external account');
  }

  const newAccount = await createExternalAccount(
    apiUrl,
    apiKey,
    bridgeCustomerId,
    account,
  );

  /**
   * Update liquidation addresses associated with the deleted account
   */
  const liquidationAddresses = await getLiquidationAddresses(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );
  const targetLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === input.id,
  );

  if (
    targetLiquidationAddress &&
    targetLiquidationAddress.destination_currency === newAccount.currency
  ) {
    const updateAddressRes = await fetch(
      `${apiUrl}/v0/customers/${bridgeCustomerId}/liquidation_addresses/${targetLiquidationAddress.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          external_account_id: newAccount.id,
        }),
        method: 'PUT',
      },
    );

    if (updateAddressRes.status !== 200) {
      console.error(await updateAddressRes.json());
      throw Error('Error updating liquidation address');
    }
  }

  return {
    success: true,
  };
};

module.exports = {
  updateExternalAccountHandler,
};
