import React from 'react';
import { useAppContext, useStakingSlider } from '~hooks';

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
  const { user } = useAppContext();
  const {
    remainingToStake,
    totalPercentageStaked,
    userMinStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    enoughTokensToStakeMinimum,
    isLoadingData,
    userActivatedTokens,
  } = useStakingSlider(isObjection);

  const displayLabel = !!user && !isLoadingData && remainingToStake !== '0';

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
      {displayLabel && (
        <StakingValidationMessage
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
          userActivatedTokens={userActivatedTokens}
          userMinStake={userMinStake}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
