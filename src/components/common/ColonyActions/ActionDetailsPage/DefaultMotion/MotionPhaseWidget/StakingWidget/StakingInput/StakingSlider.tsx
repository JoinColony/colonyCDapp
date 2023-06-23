import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~hooks';
import { SetStateFn } from '~types';

import {
  SLIDER_AMOUNT_KEY,
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
  const { watch, setValue } = useFormContext();

  const displayErrMsg =
    !!user && !isLoadingData && totalPercentageStaked !== 200;
  const displayLabel = displayErrMsg && enoughReputationToStakeMinimum;

  useEffect(() => {
    const amount = watch(SLIDER_AMOUNT_KEY);
    const userStakeLimitPercentage = userStakeLimitDecimal.times(100);

    if (userStakeLimitPercentage.lessThan(amount)) {
      setLimitExceeded(true);
      setValue(SLIDER_AMOUNT_KEY, userStakeLimitPercentage.toString());
    }
  }, [userStakeLimitDecimal, watch, setLimitExceeded, setValue]);

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
