import { ColonyWallet, Token } from '~types';

export interface BalanceProps {
  nativeToken?: Token;
  wallet?: ColonyWallet | null;
}

export interface ReputationProps {
  colonyAddress?: string;
  wallet?: ColonyWallet | null;
}
