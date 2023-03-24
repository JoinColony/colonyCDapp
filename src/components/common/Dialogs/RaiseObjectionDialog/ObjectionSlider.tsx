import React from 'react';

import { StakingSlider } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { DialogSection } from '~shared/Dialog';

import styles from './ObjectionSlider.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionSlider';

interface ObjectionSliderProps {
  canBeStaked: boolean;
}

const ObjectionSlider = ({ canBeStaked }: ObjectionSliderProps) => (
  <DialogSection appearance={{ theme: 'sidePadding' }}>
    <div className={styles.main}>
      <StakingSlider canBeStaked={canBeStaked} isObjection />
    </div>
  </DialogSection>
);

ObjectionSlider.displayName = displayName;

export default ObjectionSlider;
