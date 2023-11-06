import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { TabItem } from '~shared/Extensions/Tabs/types';
import { Token, UserStake, Colony } from '~types';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/types';

export interface StakesListProps {
  loading: boolean;
  stakes: UserStake[];
  colony: Colony;
  filterOption: StakesFilterOption;
  onMotionStateFetched: (
    stakeId: string,
    motionState: NetworkMotionState,
  ) => void;
  motionStatesMap: Map<string, NetworkMotionState>;
  motionStatesLoading: boolean;
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

export type StakesFilterOption = 'all' | 'finalizable' | 'claimable';

export interface StakesTabItem extends TabItem {
  type: StakesFilterOption;
  showNotificationNumber?: boolean;
}
