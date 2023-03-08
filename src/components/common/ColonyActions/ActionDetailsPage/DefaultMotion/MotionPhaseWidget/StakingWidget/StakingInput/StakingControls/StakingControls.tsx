import React from 'react';

import Button from '~shared/Button';
import { useStakingControls } from '~hooks';

import { StakeButton, ObjectButton, ActivateButton } from '.';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

interface StakingControlsProps {
  limitExceeded: boolean;
}

const StakingControls = ({ limitExceeded }: StakingControlsProps) => {
  const {
    showActivateButton,
    showBackButton,
    showObjectButton,
    stake,
    setIsSummary,
  } = useStakingControls(limitExceeded);

  return (
    <div className={styles.buttonGroup}>
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
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
