import React from 'react';
import { useStakingSlider } from '~hooks';

import {
  StakingSliderDescription,
  StakingSliderLabel,
  StakingValidationMessage,
  StakingWidgetSlider,
} from '.';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingSlider';

interface StakingSliderProps {
  isObjection: boolean;
}

const StakingSlider = ({ isObjection }: StakingSliderProps) => {
  const {
    remainingToStake,
    totalPercentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    isLoadingData,
    enoughTokensToStakeMinimum,
  } = useStakingSlider(isObjection);

  const displayLabel = !isLoadingData && remainingToStake !== '0';

  return (
    <>
      <StakingSliderDescription isObjection={isObjection} />
      {displayLabel && (
        <StakingSliderLabel
          requiredStakeMessageProps={{
            totalPercentageStaked,
            remainingToStake,
            userMinStake,
            nativeTokenDecimals,
            nativeTokenSymbol,
          }}
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        />
      )}
      <StakingWidgetSlider
        isObjection={isObjection}
        isLoading={isLoadingData}
        remainingToStake={remainingToStake}
        enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
      />
      {!isLoadingData && (
        <StakingValidationMessage
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
          tokensLeftToActivate={tokensLeftToActivate}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
