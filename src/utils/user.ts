import { apolloClient } from '~apollo';
import {
  GetUserLiquidationAddressesDocument,
  type GetUserLiquidationAddressesQuery,
  type GetUserLiquidationAddressesQueryVariables,
} from '~gql';
import { type Address } from '~types';
import { type User } from '~types/graphql.ts';

export const getUserPaymentAddress = async (user: User): Promise<Address> => {
  if (!user.profile?.isAutoOfframpEnabled) {
    return user.walletAddress;
  }

  // @TODO fetch user address via the lambda, for now it's a random address

  const { data } = await apolloClient.query<
    GetUserLiquidationAddressesQuery,
    GetUserLiquidationAddressesQueryVariables
  >({
    query: GetUserLiquidationAddressesDocument,
    variables: {
      userAddress: user.walletAddress,
    },
  });

  const liquidationAddress =
    data.getLiquidationAddressesByUserAddress?.items[0]?.liquidationAddress;

  if (!liquidationAddress) {
    console.error('User has autoramp enabled and no liquidation address');
    return user.walletAddress;
  }

  return liquidationAddress;
};
