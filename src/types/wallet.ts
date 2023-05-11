import { WalletState } from '@web3-onboard/core';

export type ColonyWallet = BasicWallet | FullWallet;

export interface FullWallet extends WalletState {
  address: string;
  balance: Record<string, string>;
  ens?: string | null;
}

export type BasicWallet = Pick<FullWallet, 'address' | 'label' | 'chains'>;

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
