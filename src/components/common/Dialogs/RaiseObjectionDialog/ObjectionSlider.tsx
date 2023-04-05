import React from 'react';

import { StakingSlider } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { DialogSection } from '~shared/Dialog';

import styles from './ObjectionSlider.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionSlider';

const ObjectionSlider = () => (
  <DialogSection appearance={{ theme: 'sidePadding' }}>
    <div className={styles.main}>
      <StakingSlider isObjection />
    </div>
  </DialogSection>
);

ObjectionSlider.displayName = displayName;

export default ObjectionSlider;
