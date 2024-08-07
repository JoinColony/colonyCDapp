import { type Token } from '~types/graphql.ts';
import { type ColonyWallet } from '~types/wallet.ts';

import { type UserHubTab } from '../../types.ts';

export interface ReputationTabProps {
  onTabChange: (newTab: UserHubTab) => void;
}

export interface BalanceProps extends Pick<ReputationTabProps, 'onTabChange'> {
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
