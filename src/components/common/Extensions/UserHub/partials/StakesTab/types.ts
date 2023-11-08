import { TabItem } from '~shared/Extensions/Tabs/types';
import { Token, Colony, UserStakeStatus, UserStakeWithStatus } from '~types';

export interface StakesListProps {
  loading: boolean;
  stakes: UserStakeWithStatus[];
  colony: Colony;
}

export interface StakeItemProps {
  stake: UserStakeWithStatus;
  nativeToken: Token;
  colonyAddress: string;
}

export type StakesFilterType = 'all' | 'finalizable' | 'claimable';

export interface StakesFilterOption extends TabItem {
  id: number;
  type: StakesFilterType;
  title: string;
  stakeStatuses: UserStakeStatus[];
  showNotificationNumber?: boolean;
  requiresMotionState?: boolean;
}
