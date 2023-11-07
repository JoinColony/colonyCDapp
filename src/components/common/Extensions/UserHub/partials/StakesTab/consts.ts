import { UserStakeStatus } from '~types';

import { StakesFilterOption } from './types';

export const stakesFilterOptions: StakesFilterOption[] = [
  {
    id: 0,
    type: 'all',
    title: 'All',
    stakeStatuses: [
      UserStakeStatus.Staking,
      UserStakeStatus.Finalizable,
      UserStakeStatus.Claimable,
      UserStakeStatus.Claimed,
      UserStakeStatus.Unknown,
    ],
  },
  {
    id: 1,
    type: 'finalizable',
    title: 'Finalizable',
    stakeStatuses: [UserStakeStatus.Finalizable],
    showNotificationNumber: true,
    requiresMotionState: true,
  },
  {
    id: 2,
    type: 'claimable',
    title: 'Claimable',
    stakeStatuses: [UserStakeStatus.Claimable],
    showNotificationNumber: true,
    requiresMotionState: true,
  },
];
