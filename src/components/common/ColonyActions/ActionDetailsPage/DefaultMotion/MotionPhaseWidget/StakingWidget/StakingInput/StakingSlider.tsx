import React from 'react';
import { useAppContext } from '~hooks';
import { SetStateFn } from '~types';

import {
  StakingSliderDescription,
  StakingSliderLabel,
  StakingValidationMessage,
  StakingWidgetSlider,
  useStakingSlider,
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
    enoughReputationToStakeMinimum,
    userMaxStake,
  } = useStakingSlider(isObjection);

  const displayErrMsg = !!user && !isLoadingData && remainingToStake !== '0';
  const displayLabel = displayErrMsg && enoughReputationToStakeMinimum;

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
        enoughReputationToStakeMinimum={enoughReputationToStakeMinimum}
        limit={userStakeLimitDecimal}
        handleLimitExceeded={setLimitExceeded}
      />
      {displayErrMsg && (
        <StakingValidationMessage
          enoughReputationToStakeMinimum={enoughReputationToStakeMinimum}
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
          userMinStake={userMinStake}
          userActivatedTokens={userActivatedTokens}
          userMaxStake={userMaxStake}
          remainingToStake={remainingToStake}
          nativeTokenDecimals={nativeTokenDecimals}
          limitExceeded={limitExceeded}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
