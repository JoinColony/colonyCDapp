import { type TabItem } from '~shared/Extensions/Tabs/types.ts';
import { type Token, type Colony } from '~types/graphql.ts';
import {
  type UserStakeStatus,
  type UserStakeWithStatus,
} from '~types/userStake.ts';

export interface StakesListProps {
  loading: boolean;
  stakes: UserStakeWithStatus[];
  colony: Colony;
}

export interface StakeItemProps {
  stake: UserStakeWithStatus;
  nativeToken: Token;
  colony: Colony;
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
