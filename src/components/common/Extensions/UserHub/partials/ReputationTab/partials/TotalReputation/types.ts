import { type Token } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface TotalReputationProps {
  colonyAddress: string;
  wallet: ColonyWallet;
  nativeToken: Token;
  className?: string;
}
