import { Token, ColonyWallet } from '~types';

export interface PendingReputationProps {
  nativeToken: Token;
  colonyAddress: string;
  wallet: ColonyWallet;
  className?: string;
}
