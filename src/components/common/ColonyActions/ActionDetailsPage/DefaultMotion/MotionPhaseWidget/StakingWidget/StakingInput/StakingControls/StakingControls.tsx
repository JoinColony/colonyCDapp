import React from 'react';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

import { BackButton, ObjectButton, StakeButton } from '.';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

const StakingControls = () => {
  const {
    motionStakes: {
      raw: { nay: nayStakes },
    },
  } = useStakingWidgetContext();
  const showBackButton = nayStakes !== '0';

  return (
    <div className={styles.buttonGroup}>
      {showBackButton && <BackButton />}
      <StakeButton />
      {!showBackButton && <ObjectButton />}
      {/*
      {showActivateButton && <ActivateButton />}
      */}
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
