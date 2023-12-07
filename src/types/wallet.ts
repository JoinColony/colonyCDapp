import { WalletState } from '@web3-onboard/core';
import { Account } from '@web3-onboard/core/dist/types';

import RetryRpcProvider from '../redux/sagas/wallet/RetryProvider';

export type ColonyWallet = BasicWallet | FullWallet;

export interface FullWallet extends WalletState, Account {
  // @ts-ignore
  ethersProvider: InstanceType<typeof RetryRpcProvider> | null;
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
