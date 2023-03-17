import React from 'react';

import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakeButton';

const StakeButton = () => {
  const isObjection = false;
  return (
    <Button
      appearance={{
        theme: isObjection ? 'danger' : 'primary',
        size: 'medium',
      }}
      type="submit"
      disabled={false}
      text={{ id: 'button.stake' }}
      dataTest="stakeWidgetStakeButton"
    />
  );
};

StakeButton.displayName = displayName;

export default StakeButton;
