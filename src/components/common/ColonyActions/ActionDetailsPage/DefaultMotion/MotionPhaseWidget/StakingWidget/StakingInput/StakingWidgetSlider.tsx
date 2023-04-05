import Decimal from 'decimal.js';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppContext } from '~hooks';

import Slider from '~shared/Slider';
import { SetStateFn } from '~types';
import { SLIDER_AMOUNT_KEY } from './StakingInput';

import styles from './StakingWidgetSlider.css';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingWidgetSlider';

interface StakingWidgetSliderProps {
  isLoading: boolean;
  remainingToStake: string;
  enoughTokensToStakeMinimum: boolean;
  isObjection: boolean;
  limit: Decimal;
  handleLimitExceeded: SetStateFn;
}

const StakingWidgetSlider = ({
  isLoading,
  remainingToStake,
  enoughTokensToStakeMinimum,
  isObjection,
  limit,
  handleLimitExceeded,
}: StakingWidgetSliderProps) => {
  const { user } = useAppContext();
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);

  return (
    <div className={styles.sliderContainer}>
      <Slider
        name="amount"
        value={sliderAmount}
        limit={limit}
        step={1}
        min={0}
        max={100}
        disabled={
          isLoading ||
          !user ||
          remainingToStake === '0' ||
          !enoughTokensToStakeMinimum
        }
        appearance={{
          theme: isObjection ? 'danger' : 'primary',
          size: 'thick',
        }}
        handleLimitExceeded={handleLimitExceeded}
      />
    </div>
  );
};

StakingWidgetSlider.displayName = displayName;

export default StakingWidgetSlider;
