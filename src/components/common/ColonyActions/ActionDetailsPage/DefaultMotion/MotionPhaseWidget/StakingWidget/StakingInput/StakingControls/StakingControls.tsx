import React from 'react';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

const StakingControls = () => {
  return (
    <div className={styles.buttonGroup}>
      {/*
      {showBackButton && (
        <Button
          appearance={{ theme: 'secondary', size: 'medium' }}
          text={{ id: 'button.back' }}
          onClick={() => setIsSummary(true)}
        />
      )}
      <StakeButton stake={stake} />
      {showObjectButton && <ObjectButton />}
      {showActivateButton && <ActivateButton />}
      */}
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
