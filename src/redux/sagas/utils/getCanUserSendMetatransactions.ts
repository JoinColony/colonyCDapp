import { utils } from 'ethers';
import { getContext, ContextModule } from '~context';
import { canUseMetatransactions } from '~utils/checks';
import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';

export function* getCanUserSendMetatransactions() {
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
    data.getUserByAddress?.items[0]?.profile?.meta?.metatransactionsEnabled ||
    false;

  return userHasMetatransactionEnabled;
}
