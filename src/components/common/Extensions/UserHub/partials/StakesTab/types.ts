import { TabItem } from '~shared/Extensions/Tabs/types';
import { UserStakeStatus } from '~types';

import { StakesTabContentListItem } from './partials/StakesTabContentList/types';

export type StakesFilterType = 'all' | 'finalizable' | 'claimable';

export interface StakesFilterOption extends Omit<TabItem, 'type'> {
  type: StakesFilterType;
  title: string;
  stakeStatuses: UserStakeStatus[];
  showNotificationNumber?: boolean;
  requiresMotionState?: boolean;
}

export interface UseStakesByFilterTypeReturnType {
  stakesByFilterType: Record<StakesFilterType, StakesTabContentListItem[]>;
  filtersDataLoading: Record<StakesFilterType, boolean>;
  updateClaimedStakesCache: (claimedStakesIds: string[]) => void;
}
