import { UserStake } from '~types';

import { StakesFilterType } from './types';
import { stakesFilterOptions } from './consts';

export const getStakesTabItems = (
  stakesByFilterType: Record<StakesFilterType, UserStake[]>,
  motionStatesLoading: boolean,
  activeFilterType: StakesFilterType,
) =>
  stakesFilterOptions.map((option) => {
    if (
      !option.showNotificationNumber ||
      (option.requiresMotionState && motionStatesLoading)
    ) {
      return option;
    }

    const notificationNumber = stakesByFilterType[option.type].length;

    return {
      ...option,
      notificationNumber,
      active: option.type === activeFilterType,
    };
  });
