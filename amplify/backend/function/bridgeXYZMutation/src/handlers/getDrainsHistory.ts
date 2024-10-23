import fetch from 'cross-fetch';
import { graphqlRequest } from '../utils';
import { getUser } from '../graphql';
import { getLiquidationAddresses } from './utils';
import { AppSyncResolverEvent, HandlerContext } from 'src/types';
import { BridgeDrain, LiquidationAddress } from '~gql';

export const getDrainsHistoryHandler = async (
  event: AppSyncResolverEvent,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL }: HandlerContext,
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  const response = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const colonyUser = response?.data?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;

  const liquidationAddresses: LiquidationAddress[] =
    await getLiquidationAddresses(apiUrl, apiKey, bridgeCustomerId);

  if (!liquidationAddresses.length) {
    return [];
  }

  const liquidationAddressIds = liquidationAddresses.map((item) => item.id);

  const drains: BridgeDrain[] = [];

  for (const liquidationAddressId of liquidationAddressIds) {
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

    const drainsResult: { data: BridgeDrain[] } = await drainsRes.json();

    const mappedDrains: BridgeDrain[] = drainsResult.data.map((drain) => ({
      id: drain.id,
      amount: drain.amount,
      currency: drain.currency,
      state: drain.state,
      // @ts-ignore
      createdAt: drain.created_at,
      receipt: drain.receipt
        ? {
            url: drain.receipt.url,
          }
        : null,
    }));

    drains.push(...mappedDrains);
  }

  return drains;
};

export default getDrainsHistoryHandler;
