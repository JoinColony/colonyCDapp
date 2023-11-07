import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { TabItem } from '~shared/Extensions/Tabs/types';
import { Token, UserStake, Colony, UserStakeStatus } from '~types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface StakesListProps {
  loading: boolean;
  stakes: UserStake[];
  colony: Colony;
  onMotionStateFetched: (
    stakeId: string,
    motionState: NetworkMotionState,
  ) => void;
}

export interface StakeItemProps
  extends Pick<StakesListProps, 'onMotionStateFetched'> {
  key: string;
  title: string;
  date: string;
  stake: string;
  transfer: string;
  status?: Omit<
    ExtensionStatusBadgeMode,
    'staking' | 'finalizable' | 'claimed'
  >;
  userStake: UserStake;
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
