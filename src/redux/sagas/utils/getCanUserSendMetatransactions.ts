import { utils } from 'ethers';

import { getContext, ContextModule } from '~context/index.ts';
import {
  GetOwnUserDocument,
  type GetOwnUserQuery,
  type GetOwnUserQueryVariables,
} from '~gql';
import { canUseMetatransactions } from '~utils/checks/index.ts';

import type { ApolloQueryResult } from '@apollo/client';

export function* metatransactionsEnabled() {
  const metatransactionsAvailable = canUseMetatransactions();

  if (!metatransactionsAvailable) {
    return false;
  }

  const wallet = getContext(ContextModule.Wallet);
  const apolloClient = getContext(ContextModule.ApolloClient);

  const checksummedWalletAddress = utils.getAddress(wallet.address);

  const { data }: ApolloQueryResult<GetOwnUserQuery> = yield apolloClient.query<
    GetOwnUserQuery,
    GetOwnUserQueryVariables
  >({
    query: GetOwnUserDocument,
    variables: {
      address: checksummedWalletAddress,
    },
  });

  const userHasMetatransactionEnabled =
    !!data.getUserByAddress?.items[0]?.profile?.meta?.metatransactionsEnabled;

  return userHasMetatransactionEnabled;
}
