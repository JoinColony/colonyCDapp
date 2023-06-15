import React, { useState } from 'react';

import { StakingSlider } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { DialogSection } from '~shared/Dialog';

import styles from './ObjectionSlider.css';

const displayName = 'common.Dialogs.RaiseObjectionDialog.ObjectionSlider';

const ObjectionSlider = () => {
  // Note: this doesn't live in StakingSlider because it's also needed by StakingControls
  const [limitExceeded, setLimitExceeded] = useState(false);
  return (
    <DialogSection appearance={{ theme: 'sidePadding' }}>
      <div className={styles.main}>
        <StakingSlider
          isObjection
          limitExceeded={limitExceeded}
          setLimitExceeded={setLimitExceeded}
        />
      </div>
    </DialogSection>
  );
};

ObjectionSlider.displayName = displayName;

export default ObjectionSlider;
