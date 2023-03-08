import { useFormContext } from 'react-hook-form';

import {
  getStakeFromSlider,
  SLIDER_AMOUNT_KEY,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

const useStakingControls = (limitExceeded: boolean) => {
  const {
    enoughReputation,
    nayPercentage,
    canBeStaked,
    remainingToStake,
    minUserStake,
    getErrorType,
    setIsSummary,
  } = useStakingWidgetContext();
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);
  const stake = getStakeFromSlider(
    sliderAmount,
    remainingToStake,
    minUserStake,
  );

  const showObjectButton = nayPercentage === '0.00';
  const showBackButton = !showObjectButton;
  const showActivateButton =
    enoughReputation &&
    canBeStaked &&
    getErrorType(limitExceeded) === 'stakeMoreTokens';

  return {
    stake,
    showActivateButton,
    showBackButton,
    showObjectButton,
    setIsSummary,
  };
};

export default useStakingControls;
