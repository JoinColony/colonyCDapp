import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { type MotionStatesMap } from '~hooks/useNetworkMotionStates.ts';
import { type UserStake } from '~types/graphql.ts';
import { UserStakeStatus } from '~types/userStake.ts';

import { stakesFilterOptions } from './consts.ts';
import { type StakesFilterType } from './types.ts';

export const getStakesTabItems = (
  stakesByFilterType: Record<StakesFilterType, UserStake[]>,
  filtersDataLoading: Record<StakesFilterType, boolean>,
  activeFilterType: StakesFilterType,
) =>
  stakesFilterOptions.map((option) => {
    if (!option.showNotificationNumber || filtersDataLoading[option.type]) {
      return option;
    }

    const notificationNumber = stakesByFilterType[option.type].length;

    return {
      ...option,
      notificationNumber,
      active: option.type === activeFilterType,
    };
  });

export const getStakeStatus = (
  stake: UserStake,
  statesMap: MotionStatesMap,
  votingReputationByColony: Record<string, string>,
) => {
  if (stake.isClaimed) {
    return UserStakeStatus.Claimed;
  }

  const colonyAddress = stake.action?.colonyAddress ?? '';
  const currentMotionId = stake.action?.motionData?.motionId ?? '';
  const motionMapName = `${colonyAddress}-${currentMotionId}`;
  const motionState = statesMap.get(motionMapName);
  const isVotingReputationEnabled =
    colonyAddress && votingReputationByColony[colonyAddress];
  // if voting reputation enabled, votingReputationAddress will be present in votingReputationByColony
  if (!isVotingReputationEnabled || !motionState) {
    return UserStakeStatus.Lost;
  }

  if (motionState === NetworkMotionState.Finalizable) {
    return UserStakeStatus.Finalizable;
  }
  if (
    motionState === NetworkMotionState.Finalized ||
    motionState === NetworkMotionState.Failed
  ) {
    return UserStakeStatus.Claimable;
  }

  return UserStakeStatus.Staking;
};
