import { type WalletState } from '@web3-onboard/core';
import { type Account } from '@web3-onboard/core/dist/types';

import { type CustomEIP1193Provider } from '~redux/sagas/wallet/ganacheModule.ts';
import retryRpcProviderFactory from '~redux/sagas/wallet/RetryProvider.ts';

export type ColonyWallet = BasicWallet | FullWallet;

const RetryProvider = retryRpcProviderFactory(undefined);

export interface FullWallet extends WalletState, Account {
  ethersProvider: InstanceType<typeof RetryProvider>;
  provider: CustomEIP1193Provider;
}

export type BasicWallet = Pick<
  FullWallet,
  'address' | 'label' | 'chains' | 'ethersProvider'
>;

export const isBasicWallet = (
  wallet?: ColonyWallet | null,
): wallet is BasicWallet => {
  if (!wallet || 'balance' in wallet) {
    return false;
  }

  return true;
};

export const isFullWallet = (
  wallet?: ColonyWallet | null,
): wallet is FullWallet => !!wallet && 'balance' in wallet;
