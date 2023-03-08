import Decimal from 'decimal.js';
import React from 'react';

import { useStakingWidgetSlider } from '~hooks';
import Slider from '~shared/Slider';
import { SetStateFn } from '~types';

import styles from './StakingWidgetSlider.css';

export interface StakingWidgetSliderProps {
  isObjection: boolean;
  canBeStaked: boolean;
  maxUserStake: Decimal;
  minUserStake: Decimal;
  remainingToStake: Decimal;
  setLimitExceeded: SetStateFn;
  userActivatedTokens: Decimal;
}

const StakingWidgetSlider = ({
  isObjection,
  canBeStaked,
  maxUserStake,
  minUserStake,
  remainingToStake,
  setLimitExceeded,
  userActivatedTokens,
}: StakingWidgetSliderProps) => {
  const { userStakeLimitPercentage, sliderAmount } = useStakingWidgetSlider({
    maxUserStake,
    minUserStake,
    remainingToStake,
    userActivatedTokens,
  });
  return (
    <div className={styles.sliderContainer}>
      <Slider
        name="amount"
        value={sliderAmount}
        limit={userStakeLimitPercentage}
        step={1}
        min={0}
        max={100}
        disabled={!canBeStaked}
        appearance={{
          theme: isObjection ? 'danger' : 'primary',
          size: 'thick',
        }}
        handleLimitExceeded={setLimitExceeded}
      />
    </div>
  );
};

export default StakingWidgetSlider;
