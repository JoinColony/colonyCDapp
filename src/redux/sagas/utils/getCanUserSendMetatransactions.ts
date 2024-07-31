import { utils } from 'ethers';

import { getContext, ContextModule } from '~context/index.ts';
import {
  GetUserByAddressDocument,
  type GetUserByAddressQuery,
  type GetUserByAddressQueryVariables,
} from '~gql';
import { canUseMetatransactions } from '~utils/checks/index.ts';

export function* metatransactionsEnabled() {
  const metatransactionsAvailable = canUseMetatransactions();

  if (!metatransactionsAvailable) {
    return false;
  }

  const wallet = getContext(ContextModule.Wallet);
  const apolloClient = getContext(ContextModule.ApolloClient);

  const checksummedWalletAddress = utils.getAddress(wallet.address);

  const { data } = yield apolloClient.query<
    GetUserByAddressQuery,
    GetUserByAddressQueryVariables
  >({
    query: GetUserByAddressDocument,
    variables: {
      address: checksummedWalletAddress,
    },
  });

  const userHasMetatransactionEnabled =
    !!data.getUserByAddress?.items[0]?.profile?.meta?.metatransactionsEnabled;

  return userHasMetatransactionEnabled;
}
