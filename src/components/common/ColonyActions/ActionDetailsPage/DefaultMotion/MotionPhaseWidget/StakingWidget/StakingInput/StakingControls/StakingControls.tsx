import React from 'react';

import { BackButton, ObjectButton, StakeButton } from '.';
import useStakingControls from './useStakingControls';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

interface StakingControlsProps {
  limitExceeded: boolean;
}

const StakingControls = ({ limitExceeded }: StakingControlsProps) => {
  const { showBackButton, enoughTokensToStakeMinimum, isLoadingData } =
    useStakingControls(limitExceeded);

  return (
    <div className={styles.buttonGroup}>
      {showBackButton && <BackButton />}
      <StakeButton
        isLoadingData={isLoadingData}
        enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
      />
      {!showBackButton && (
        <ObjectButton
          isLoadingData={isLoadingData}
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        />
      )}
      {/*
      {showActivateButton && <ActivateButton />}
      */}
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
