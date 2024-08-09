import { UserStakeStatus } from '~types/userStake.ts';

import { type StakesFilterOption } from './types.ts';

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
      UserStakeStatus.Lost,
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
