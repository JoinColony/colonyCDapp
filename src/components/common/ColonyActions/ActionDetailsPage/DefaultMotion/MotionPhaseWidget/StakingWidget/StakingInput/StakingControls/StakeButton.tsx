import React from 'react';
import Decimal from 'decimal.js';

import Button from '~shared/Button';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakeButton';

interface StakeButtonProps {
  stake: Decimal;
}
const StakeButton = ({ stake }: StakeButtonProps) => {
  const { canBeStaked, isObjection, userActivatedTokens } =
    useStakingWidgetContext();

  const isStakeButtonDisabled =
    !canBeStaked || userActivatedTokens.lt(stake.round().toString());

  return (
    <Button
      appearance={{
        theme: isObjection ? 'danger' : 'primary',
        size: 'medium',
      }}
      type="submit"
      disabled={isStakeButtonDisabled}
      text={{ id: 'button.stake' }}
      dataTest="stakeWidgetStakeButton"
    />
  );
};

StakeButton.displayName = displayName;

export default StakeButton;
