import React from 'react';

import { useAppContext } from '~hooks';
import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

interface ObjectButtonProps {
  isLoadingData: boolean;
  enoughTokensToStakeMinimum: boolean;
  enoughReputationToStakeMinimum: boolean;
}

const ObjectButton = ({
  isLoadingData,
  enoughTokensToStakeMinimum,
  enoughReputationToStakeMinimum,
}: ObjectButtonProps) => {
  const { user } = useAppContext();

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={
        !user ||
        isLoadingData ||
        !enoughTokensToStakeMinimum ||
        !enoughReputationToStakeMinimum
      }
      dataTest="stakeWidgetObjectButton"
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
