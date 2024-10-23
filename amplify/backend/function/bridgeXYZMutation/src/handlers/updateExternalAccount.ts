import fetch from 'cross-fetch';
import { graphqlRequest } from '../utils';
import {
  createExternalAccount,
  deleteExternalAccount,
  getLiquidationAddresses,
  getExternalAccounts,
} from './utils';
import { getUser } from '../graphql';
import { HandlerContext } from '../types';
import { AppSyncResolverEvent } from 'aws-lambda';
import { BridgeCreateBankAccountInput, User } from '~gql';

type InputArguments = {
  input: {
    account?: BridgeCreateBankAccountInput;
    id?: string;
  };
};

export const updateExternalAccountHandler = async (
  event: AppSyncResolverEvent<InputArguments>,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL }: HandlerContext,
): Promise<{ success: boolean }> => {
  const input = event.arguments.input;
  const account = input.account;

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  if (!account?.iban && !account?.usAccount) {
    throw new Error('Account details must be provided');
  }

  if (account.currency === 'usd' && !account.address) {
    throw new Error('Address must be provided for US accounts');
  }

  const response = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const bridgeCustomerId: User['bridgeCustomerId'] =
    response?.data?.getUser?.bridgeCustomerId;

  if (!bridgeCustomerId) {
    throw new Error('No bridgeCustomerId found');
  }

  const externalAccounts = await getExternalAccounts(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );

  const newAccount = await createExternalAccount(
    apiUrl,
    apiKey,
    bridgeCustomerId,
    account,
  );

  const deletePromises = externalAccounts.map(async ({ id }) =>
    deleteExternalAccount(apiUrl, apiKey, bridgeCustomerId, id),
  );

  await Promise.all(deletePromises);

  /**
   * Update liquidation addresses associated with the deleted account
   * Only if the currency is the same as the new account
   * Otherwise, creating new liquidation address is handled elsewhere
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
      throw new Error(
        `Error updating liquidation address: ${await updateAddressRes.text()}`,
      );
    }
  }

  return {
    success: true,
  };
};

export default updateExternalAccountHandler;
