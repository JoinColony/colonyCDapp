import React, { useRef } from 'react';
import { useStakingSlider } from '~hooks';

import {
  SliderAnnotation,
  SliderDescription,
  StakingValidationMessage,
} from './SliderMessages';
import StakingWidgetSlider from './StakingWidgetSlider';
import {
  SomeSliderAnnotationProps,
  SomeStakingValidationProps,
  SomeStakingWidgetSliderProps,
} from './types';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingSlider';

export interface StakingSliderProps {
  sliderAnnotationProps: SomeSliderAnnotationProps;
  stakingWidgetSliderProps: SomeStakingWidgetSliderProps;
  stakingValidationMessageProps: SomeStakingValidationProps;
  mutableRef?: ReturnType<typeof useRef>;
}

const StakingSlider = ({
  stakingWidgetSliderProps: {
    isObjection,
    minUserStake,
    remainingToStake,
    maxUserStake,
  },
  stakingWidgetSliderProps,
  sliderAnnotationProps: { enoughTokens, totalPercentage },
  stakingValidationMessageProps: { nativeTokenDecimals, nativeTokenSymbol },
  stakingValidationMessageProps,
  mutableRef,
}: StakingSliderProps) => {
  const {
    showAnnotation,
    showValidationMessage,
    requiredStakeMessageProps,
    limitExceeded,
    setLimitExceeded,
  } = useStakingSlider({
    minUserStake,
    mutableRef,
    nativeTokenDecimals,
    nativeTokenSymbol,
    remainingToStake,
    totalPercentage,
  });
  return (
    <>
      <SliderDescription isObjection={isObjection} />
      {showAnnotation && (
        <SliderAnnotation
          enoughTokens={enoughTokens}
          requiredStakeMessageProps={requiredStakeMessageProps}
        />
      )}
      <StakingWidgetSlider
        {...stakingWidgetSliderProps}
        setLimitExceeded={setLimitExceeded}
      />
      {showValidationMessage && (
        <StakingValidationMessage
          {...stakingValidationMessageProps}
          limitExceeded={limitExceeded}
          minUserStake={minUserStake}
          maxUserStake={maxUserStake}
        />
      )}
    </>
  );
};

StakingSlider.displayName = displayName;

export default StakingSlider;
