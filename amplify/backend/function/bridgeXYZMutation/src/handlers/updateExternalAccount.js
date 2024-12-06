const { getUser } = require('../api/graphql/schemas');
const { graphqlRequest } = require('../api/graphql/utils');
const {
  handlePut,
  createExternalAccount,
  deleteExternalAccount,
  getLiquidationAddresses,
  getExternalAccounts,
} = require('../api/rest/bridge');

const updateExternalAccountHandler = async (event) => {
  const input = event.arguments.input;
  const account = input.account;

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  if (!account.iban && !account.usAccount) {
    throw new Error('Account details must be provided');
  }

  if (account.currency === 'usd' && !account.address) {
    throw new Error('Address must be provided for US accounts');
  }

  const { data: graphQlData } = await graphqlRequest(getUser, {
    id: checksummedWalletAddress,
  });

  const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

  const externalAccounts = await getExternalAccounts(bridgeCustomerId);

  const newAccount = await createExternalAccount(bridgeCustomerId, account);

  const deletePromises = externalAccounts.map(async ({ id }) =>
    deleteExternalAccount(bridgeCustomerId, id),
  );

  await Promise.all(deletePromises);

  /**
   * Update liquidation addresses associated with the deleted account
   * Only if the currency is the same as the new account
   * Otherwise, creating new liquidation address is handled elsewhere
   */
  const liquidationAddresses = await getLiquidationAddresses(bridgeCustomerId);
  const targetLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === input.id,
  );

  if (
    targetLiquidationAddress &&
    targetLiquidationAddress.destination_currency === newAccount.currency
  ) {
    const updateAddressRes = await handlePut(
      `v0/customers/${bridgeCustomerId}/liquidation_addresses/${targetLiquidationAddress.id}`,
      {
        external_account_id: newAccount.id,
      },
    );

    if (updateAddressRes.status !== 200) {
      throw Error(
        `Error updating liquidation address: ${updateAddressRes.message}`,
      );
    }
  }

  return {
    success: true,
  };
};

module.exports = {
  updateExternalAccountHandler,
};
