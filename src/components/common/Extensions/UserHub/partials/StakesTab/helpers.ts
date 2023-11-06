import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { UserStake } from '~types';

import { StakesFilterOption, StakesTabItem } from './types';

export const filterStakeByFilterOption = (
  stake: UserStake,
  filterOption: StakesFilterOption,
  motionStatesMap: Map<string, NetworkMotionState>,
) => {
  const motionState = motionStatesMap.get(stake.id);
  switch (filterOption) {
    case 'all':
      return true;
    case 'finalizable':
      return !stake.isClaimed && motionState === NetworkMotionState.Finalizable;
    case 'claimable':
      return !stake.isClaimed && motionState === NetworkMotionState.Finalized;
    default:
      return false;
  }
};

// Returns true if the selected filter option requires data which is still loading
export const isFilterOptionDataLoading = (
  filterOption: StakesFilterOption,
  motionStatesLoading: boolean,
) => {
  switch (filterOption) {
    case 'all':
      return false;
    case 'finalizable':
    case 'claimable':
      return motionStatesLoading;
    default:
      return false;
  }
};

export const getStakesTabItems = (
  tabsItems: StakesTabItem[],
  stakes: UserStake[],
  filterOption: StakesFilterOption,
  motionStatesMap: Map<string, NetworkMotionState>,
  motionStatesLoading: boolean,
) =>
  tabsItems.map((item) => {
    if (
      !item.showNotificationNumber ||
      isFilterOptionDataLoading(item.type, motionStatesLoading)
    ) {
      return item;
    }

    const notificationNumber = stakes.filter((stake) =>
      filterStakeByFilterOption(stake, item.type, motionStatesMap),
    ).length;

    return {
      ...item,
      notificationNumber,
      active: item.type === filterOption,
    };
  });
