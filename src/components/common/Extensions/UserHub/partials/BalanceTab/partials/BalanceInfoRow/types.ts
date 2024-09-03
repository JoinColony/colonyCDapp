import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';
import { type Token } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface BalanceInfoRowProps {
  nativeToken: Token;
  wallet: ColonyWallet;
  onTabChange: (newTab: UserHubTab) => void;
  className?: string;
}
