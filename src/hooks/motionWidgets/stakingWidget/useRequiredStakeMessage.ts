import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';
import {
  convertStakeToPercentage,
  formatStakePercentage,
  getStakeFromSlider,
  SLIDER_AMOUNT_KEY,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

const STAKING_THRESHOLD = 10;

interface useRequiredStakeMessageProps {
  remainingToStake: Decimal;
  totalPercentage: number;
  minUserStake: Decimal;
}

const useRequiredStakeMessage = ({
  remainingToStake,
  totalPercentage,
  minUserStake,
}: useRequiredStakeMessageProps) => {
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);

  const stake = getStakeFromSlider(
    sliderAmount,
    remainingToStake,
    minUserStake,
  );

  const stakePercentage = convertStakeToPercentage(stake, remainingToStake);

  const isThresholdAchieved = totalPercentage >= STAKING_THRESHOLD;
  const isUnderThreshold =
    !isThresholdAchieved &&
    stakePercentage.lt(STAKING_THRESHOLD - totalPercentage);

  const isOverThreshold =
    isThresholdAchieved ||
    stakePercentage.gte(STAKING_THRESHOLD - totalPercentage);

  return {
    stake,
    isUnderThreshold,
    isOverThreshold,
    stakePercentage: formatStakePercentage(stakePercentage.toNumber()),
  };
};

export default useRequiredStakeMessage;
