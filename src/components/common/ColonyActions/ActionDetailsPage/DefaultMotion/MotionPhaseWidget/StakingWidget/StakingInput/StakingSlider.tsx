import React from 'react';
import { useStakingSlider } from '~hooks';

import {
  StakingSliderDescription,
  StakingSliderLabel,
  StakingWidgetSlider,
} from '.';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingSlider';

interface StakingSliderProps {
  isObjection: boolean;
  canBeStaked: boolean;
}

const StakingSlider = ({ isObjection, canBeStaked }: StakingSliderProps) => {
  const {
    remainingToStake,
    totalPercentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
  } = useStakingSlider(isObjection);
  return (
    <>
      <StakingSliderDescription isObjection={isObjection} />
      {remainingToStake !== '0' && (
        <StakingSliderLabel
          requiredStakeMessageProps={{
            totalPercentageStaked,
            remainingToStake,
            userMinStake,
            nativeTokenDecimals,
            nativeTokenSymbol,
          }}
        />
      )}
      <StakingWidgetSlider
        isObjection={isObjection}
        canBeStaked={canBeStaked}
      />
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
