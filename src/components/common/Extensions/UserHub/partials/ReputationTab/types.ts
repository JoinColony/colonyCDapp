import { Token, ColonyWallet } from '~types';

export interface BalanceProps {
  nativeToken: Token;
  wallet: ColonyWallet;
}

export interface TotalReputationProps {
  colonyAddress: string;
  wallet: ColonyWallet;
}

export interface PendingReputationProps {
  nativeToken: Token;
  colonyAddress: string;
  wallet: ColonyWallet;
}
