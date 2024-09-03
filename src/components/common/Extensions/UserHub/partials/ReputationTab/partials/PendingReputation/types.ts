import { type Token } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface PendingReputationProps {
  nativeToken: Token;
  colonyAddress: string;
  wallet: ColonyWallet;
  className?: string;
}
