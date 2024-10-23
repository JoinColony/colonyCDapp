import { graphqlRequest } from '../utils';
import { createExternalAccount } from './utils';
import { getUser } from '../graphql';
import { HandlerContext } from '../types';
import { AppSyncResolverEvent } from 'aws-lambda';
import { BridgeCreateBankAccountInput } from '~gql';

interface InputArguments {
  input: BridgeCreateBankAccountInput;
}

export const createExternalAccountHandler = async (
  event: AppSyncResolverEvent<InputArguments>,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL }: HandlerContext,
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const input = event.arguments?.input;

  const response = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const bridgeCustomerId = response?.data?.getUser?.bridgeCustomerId;

  await createExternalAccount(apiUrl, apiKey, bridgeCustomerId, input);

  return {
    success: true,
  };
};
