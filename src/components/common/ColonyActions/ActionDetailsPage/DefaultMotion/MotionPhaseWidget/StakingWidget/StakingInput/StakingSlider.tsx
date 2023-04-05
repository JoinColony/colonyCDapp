import React from 'react';
import { useAppContext, useStakingSlider } from '~hooks';
import { SetStateFn } from '~types';

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
  limitExceeded: boolean;
  setLimitExceeded: SetStateFn;
}

const StakingSlider = ({
  isObjection,
  limitExceeded,
  setLimitExceeded,
}: StakingSliderProps) => {
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
    userStakeLimitDecimal,
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
        limit={userStakeLimitDecimal}
        handleLimitExceeded={setLimitExceeded}
      />
      {displayLabel && (
        <StakingValidationMessage
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
          userActivatedTokens={userActivatedTokens}
          userMinStake={userMinStake}
          limitExceeded={limitExceeded}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
