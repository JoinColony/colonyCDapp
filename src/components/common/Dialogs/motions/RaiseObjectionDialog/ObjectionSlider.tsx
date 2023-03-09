import React from 'react';

import {
  StakingSlider,
  StakingSliderProps,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { DialogSection } from '~shared/Dialog';

import styles from './ObjectionSlider.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionSlider';

interface ObjectionSliderProps {
  stakingSliderProps: StakingSliderProps;
}

const ObjectionSlider = ({ stakingSliderProps }: ObjectionSliderProps) => (
  <DialogSection appearance={{ theme: 'sidePadding' }}>
    <div className={styles.main}>
      <StakingSlider {...stakingSliderProps} />
    </div>
  </DialogSection>
);

ObjectionSlider.displayName = displayName;

export default ObjectionSlider;
