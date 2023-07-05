import { Token, ColonyWallet } from '~types';

export interface BalanceProps {
  nativeToken?: Token;
  wallet?: ColonyWallet;
}

export interface ReputationProps {
  colonyAddress?: string;
  wallet?: ColonyWallet;
}
