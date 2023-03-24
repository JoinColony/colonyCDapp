import React from 'react';
import { useStakingSlider } from '~hooks';

import {
  StakingSliderAnnotation,
  StakingSliderDescription,
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
    percentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
  } = useStakingSlider(isObjection);
  return (
    <>
      <StakingSliderDescription isObjection={isObjection} />
      {remainingToStake !== '0' && (
        <StakingSliderAnnotation
          requiredStakeMessageProps={{
            percentageStaked,
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
