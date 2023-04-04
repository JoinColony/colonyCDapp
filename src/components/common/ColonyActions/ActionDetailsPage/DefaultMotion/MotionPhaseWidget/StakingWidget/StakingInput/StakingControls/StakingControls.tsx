import React from 'react';

import {
  BackButton,
  ObjectButton,
  StakeButton,
  ActivateButton,
  useStakingControls,
} from '.';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

interface StakingControlsProps {
  limitExceeded: boolean;
}

const StakingControls = ({ limitExceeded }: StakingControlsProps) => {
  const {
    showBackButton,
    showActivateButton,
    enoughTokensToStakeMinimum,
    isLoadingData,
    cantStakeMore,
  } = useStakingControls(limitExceeded);

  return (
    <div className={styles.buttonGroup}>
      {showBackButton && <BackButton />}
      <StakeButton
        isLoadingData={isLoadingData}
        enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        cantStakeMore={cantStakeMore}
      />
      {!showBackButton && (
        <ObjectButton
          isLoadingData={isLoadingData}
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        />
      )}
      {showActivateButton && <ActivateButton />}
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
