import { useImperativeHandle, useRef, useState } from 'react';
import { StakingWidgetContextValues } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { useAppContext } from '~hooks';

interface useStakingSliderProps {
  mutableRef?: ReturnType<typeof useRef>;
  remainingToStake: StakingWidgetContextValues['remainingToStake'];
  totalPercentage: StakingWidgetContextValues['totalPercentage'];
  minUserStake: StakingWidgetContextValues['minUserStake'];
  nativeTokenDecimals: StakingWidgetContextValues['nativeTokenDecimals'];
  nativeTokenSymbol: StakingWidgetContextValues['nativeTokenSymbol'];
}

const useStakingSlider = ({
  mutableRef,
  remainingToStake,
  totalPercentage,
  minUserStake,
  nativeTokenDecimals,
  nativeTokenSymbol,
}: useStakingSliderProps) => {
  const { user } = useAppContext();
  const [limitExceeded, setLimitExceeded] = useState(false);
  useImperativeHandle(mutableRef, () => ({ limitExceeded }), [limitExceeded]);
  const showAnnotation = !remainingToStake.isZero();
  const showValidationMessage = !!user;
  const requiredStakeMessageProps = {
    totalPercentage,
    remainingToStake,
    minUserStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
  };

  return {
    showAnnotation,
    showValidationMessage,
    requiredStakeMessageProps,
    limitExceeded,
    setLimitExceeded,
  };
};

export default useStakingSlider;
