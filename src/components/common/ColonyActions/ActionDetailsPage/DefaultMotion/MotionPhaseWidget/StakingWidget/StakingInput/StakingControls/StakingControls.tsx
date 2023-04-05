import React from 'react';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';
import { BackButton, ObjectButton, StakeButton } from '.';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

interface StakingControlsProps {
  isLoadingData: boolean;
  enoughTokensToStakeMinimum: boolean;
}

const StakingControls = ({
  isLoadingData,
  enoughTokensToStakeMinimum,
}: StakingControlsProps) => {
  const {
    motionStakes: {
      raw: { nay: nayStakes },
    },
    remainingToStake,
  } = useStakingWidgetContext();
  const showBackButton = nayStakes !== '0';

  return (
    <div className={styles.buttonGroup}>
      {showBackButton && <BackButton />}
      <StakeButton
        isLoadingData={isLoadingData}
        enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        remainingToStake={remainingToStake}
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
