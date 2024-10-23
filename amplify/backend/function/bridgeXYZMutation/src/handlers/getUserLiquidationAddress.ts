import { graphqlRequest } from '../utils';
import { getLiquidationAddresses, getExternalAccounts } from './utils';
import { getUser } from '../graphql';
import { AppSyncResolverEvent } from 'aws-lambda';
import { HandlerContext } from '../types';
import { LiquidationAddress } from '~gql';

type HandlerInput = {
  userAddress: LiquidationAddress['userAddress'];
};

export const getUserLiquidationAddressHandler = async (
  event: AppSyncResolverEvent<HandlerInput>,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL }: HandlerContext,
) => {
  const userAddress = event.arguments.userAddress;

  const response = await graphqlRequest(
    getUser,
    {
      id: userAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const colonyUser = response?.data?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;
  if (!bridgeCustomerId) {
    return null;
  }

  const externalAccounts = await getExternalAccounts(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );
  const firstAccount = externalAccounts?.[0];

  if (!firstAccount) {
    return null;
  }

  const liquidationAddresses = await getLiquidationAddresses(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );

  const relevantLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === firstAccount.id,
  )?.address;

  return relevantLiquidationAddress || null;
};

export default getUserLiquidationAddressHandler;
