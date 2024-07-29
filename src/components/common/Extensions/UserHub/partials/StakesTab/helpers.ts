import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { type MotionStatesMap } from '~hooks/useNetworkMotionStates.ts';
import { type VotingReputationByColonyAddress } from '~hooks/useNetworkMotionStatesAllColonies.ts';
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
  votingReputationByColony: VotingReputationByColonyAddress,
) => {
  if (stake.isClaimed) {
    return UserStakeStatus.Claimed;
  }

  if (stake.action?.expenditureId) {
    return UserStakeStatus.Staking;
  }

  const [, stakeVotingReputationAddress] =
    stake.action?.motionData?.databaseMotionId.split(/[-_]/) ?? [];

  const colonyAddress = stake.action?.colonyAddress ?? '';
  const databaseMotionId = stake.action?.motionData?.databaseMotionId ?? '';
  const motionState = statesMap.get(databaseMotionId);
  const currentVotingReputationAddress =
    colonyAddress && votingReputationByColony[colonyAddress];
  // currentVotingReputationAddress will be present in votingReputationByColony if voting reputation enabled
  if (
    !currentVotingReputationAddress ||
    !motionState ||
    currentVotingReputationAddress !== stakeVotingReputationAddress
    // this means that Voting Reputation was reinstalled and now has new address
  ) {
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
