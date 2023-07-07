import { utils } from 'ethers';
import { getContext, ContextModule } from '~context';
import { canUseMetatransactions } from '~utils/checks';
import {
  GetUserByAddressDocument,
  GetUserByAddressQuery,
  GetUserByAddressQueryVariables,
} from '~gql';

export function* getCanUserSendMetatransactions() {
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
    data.getUserByAddress?.items[0]?.profile?.advanced?.metatransactions ||
    false;

  const metatransactionsAvailable = canUseMetatransactions();

  return metatransactionsAvailable && userHasMetatransactionEnabled;
}
