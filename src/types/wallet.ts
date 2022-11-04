import { WalletState } from '@web3-onboard/core';

export interface Wallet extends WalletState {
  address: string;
  balance: Record<string, string>;
  ens?: string | null;
}

export enum DevelopmentWallets {
  Ganache = 'Ganache Wallet',
}
