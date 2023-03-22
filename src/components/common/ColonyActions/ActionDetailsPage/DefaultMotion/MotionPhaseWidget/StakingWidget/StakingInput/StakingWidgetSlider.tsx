import Decimal from 'decimal.js';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import Slider from '~shared/Slider';
import { SLIDER_AMOUNT_KEY } from './StakingInput';

import styles from './StakingWidgetSlider.css';

const StakingWidgetSlider = () => {
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);

  const isObjection = false;
  return (
    <div className={styles.sliderContainer}>
      <Slider
        name="amount"
        value={sliderAmount}
        limit={new Decimal(1)}
        step={1}
        min={0}
        max={100}
        // disabled={!canBeStaked}
        appearance={{
          theme: isObjection ? 'danger' : 'primary',
          size: 'thick',
        }}
        // handleLimitExceeded={setLimitExceeded}
      />
    </div>
  );
};

export default StakingWidgetSlider;
