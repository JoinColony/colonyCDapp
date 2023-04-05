import React from 'react';

import Button from '~shared/Button';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakeButton';

interface StakeButtonProps {
  isLoadingData: boolean;
  enoughTokensToStakeMinimum: boolean;
}

const StakeButton = ({
  isLoadingData,
  enoughTokensToStakeMinimum,
}: StakeButtonProps) => {
  const { isObjection, remainingToStake } = useStakingWidgetContext();
  return (
    <Button
      appearance={{
        theme: isObjection ? 'danger' : 'primary',
        size: 'medium',
      }}
      type="submit"
      disabled={
        isLoadingData || !enoughTokensToStakeMinimum || remainingToStake === '0'
      }
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
