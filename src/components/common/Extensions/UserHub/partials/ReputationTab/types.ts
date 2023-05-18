import { Wallet, Token } from '~types';

export interface BalanceProps {
  nativeToken?: Token;
  wallet?: Wallet;
}

export interface ReputationProps {
  colonyAddress?: string;
  wallet?: Wallet;
}
