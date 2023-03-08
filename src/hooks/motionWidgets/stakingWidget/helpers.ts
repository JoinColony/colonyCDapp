import { StakingSliderProps } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget/StakingSlider/StakingSlider';

export const mapStakingSliderProps = ({
  isObjection,
  minUserStake,
  remainingToStake,
  canBeStaked,
  maxUserStake,
  userActivatedTokens,
  nativeTokenDecimals,
  nativeTokenSymbol,
  totalPercentage,
  enoughTokens,
  reputationLoading,
  getErrorType,
  mutableRef,
}): StakingSliderProps => ({
  stakingWidgetSliderProps: {
    isObjection,
    minUserStake,
    remainingToStake,
    canBeStaked,
    maxUserStake,
    userActivatedTokens,
  },
  sliderAnnotationProps: {
    enoughTokens,
    totalPercentage,
  },
  stakingValidationMessageProps: {
    getErrorType,
    nativeTokenDecimals,
    nativeTokenSymbol,
    reputationLoading,
  },
  mutableRef,
});
