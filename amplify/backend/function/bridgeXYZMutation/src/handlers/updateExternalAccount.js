const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
const { createExternalAccount } = require('./utils');

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

  await createExternalAccount(apiUrl, apiKey, bridgeCustomerId, account);

  return {
    success: true,
  };
};

module.exports = {
  updateExternalAccountHandler,
};
