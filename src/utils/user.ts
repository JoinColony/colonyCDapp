import { type Address } from '~types';
import { type User } from '~types/graphql.ts';

export const getUserPaymentAddress = (user: User): Address => {
  if (!user.profile?.isAutoOfframpEnabled) {
    return user.walletAddress;
  }

  // @TODO fetch user address via the lambda, for now it's address zero
  return '0x0000000000000000000000000000000000000f21';
};
