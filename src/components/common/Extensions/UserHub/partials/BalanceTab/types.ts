import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';
import { type Token } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

export interface BalanceTabProps {
  onTabChange: (newTab: UserHubTab) => void;
}

export interface BalanceProps extends Pick<BalanceTabProps, 'onTabChange'> {
  nativeToken: Token;
  wallet: ColonyWallet;
}

export interface ViewStakedButtonProps {
  isFullSize?: boolean;
  onClick: () => void;
}

export interface TotalReputationProps {
  colonyAddress: string;
  wallet: ColonyWallet;
  nativeToken: Token;
}

export interface PendingReputationProps {
  nativeToken: Token;
  colonyAddress: string;
  wallet: ColonyWallet;
}
