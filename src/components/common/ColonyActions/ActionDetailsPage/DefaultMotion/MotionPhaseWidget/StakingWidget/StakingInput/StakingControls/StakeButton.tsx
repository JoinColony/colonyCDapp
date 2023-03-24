import React from 'react';

import Button from '~shared/Button';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakeButton';

const StakeButton = () => {
  const { canBeStaked, isObjection } = useStakingWidgetContext();
  return (
    <Button
      appearance={{
        theme: isObjection ? 'danger' : 'primary',
        size: 'medium',
      }}
      type="submit"
      disabled={!canBeStaked}
      /* userActivatedTokens.lt(
        getDecimalStake(values.amount).round(),
      ) */
      text={{ id: 'button.stake' }}
      dataTest="stakeWidgetStakeButton"
    />
  );
};

StakeButton.displayName = displayName;

export default StakeButton;
