import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  getUserStakeLimitPercentage,
  SLIDER_AMOUNT_KEY,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { useAppContext } from '~hooks';

const useStakingWidgetSlider = ({
  remainingToStake,
  minUserStake,
  maxUserStake,
  userActivatedTokens,
}) => {
  const { user } = useAppContext();
  const { reset, watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);

  const userStakeLimitPercentage = getUserStakeLimitPercentage(
    remainingToStake,
    minUserStake,
    maxUserStake,
    userActivatedTokens,
  );

  useEffect(() => {
    if (!user) {
      reset({ amount: 0 });
    }
  }, [user, reset]);

  return {
    userStakeLimitPercentage,
    sliderAmount,
  };
};

export default useStakingWidgetSlider;
