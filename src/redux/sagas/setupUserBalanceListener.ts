import { eventChannel } from '@redux-saga/core';
import { take } from '@redux-saga/core/effects';
import { formatEther } from 'ethers/lib/utils';

import { getContext, ContextModule } from '~context';
import { Address } from '~types';
import { log } from '~utils/debug';
// import {
//   SetLoggedInUserDocument,
//   SetLoggedInUserMutation,
//   SetLoggedInUserMutationVariables,
// } from '~data/index';

/*
 * @TOOD Refactor to remove reliance on
 */
let SetLoggedInUserDocument;
interface SetLoggedInUserMutation {
  placeholder?: boolean;
}
interface SetLoggedInUserMutationVariables {
  input: {
    balance: any;
  };
}

export function* setupUserBalanceListener(walletAddress: Address) {
  let channel;
  try {
    const { provider } = getContext(ContextModule.ColonyManager);
    const apolloClient = getContext(ContextModule.ApolloClient);

    channel = eventChannel((emit) => {
      const listener = (balance) => emit(formatEther(balance));
      provider.on(walletAddress, listener);
      return () => {
        provider.removeListener(walletAddress, listener);
      };
    });

    while (true) {
      const balance = yield take(channel);
      yield apolloClient.mutate<
        SetLoggedInUserMutation,
        SetLoggedInUserMutationVariables
      >({
        mutation: SetLoggedInUserDocument,
        variables: {
          input: { balance },
        },
      });
    }
  } catch (error) {
    log.warn('Error while listening for user balance', error);
  } finally {
    if (channel) channel.close();
  }
}
