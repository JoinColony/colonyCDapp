import React from 'react';

import Button from '~shared/Button';
import { useAppContext, useObjectButton } from '~hooks';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

interface ObjectButtonProps {
  isLoadingData: boolean;
  enoughTokensToStakeMinimum: boolean;
}

const ObjectButton = ({
  isLoadingData,
  enoughTokensToStakeMinimum,
}: ObjectButtonProps) => {
  const { user } = useAppContext();
  const { handleObjection } = useObjectButton();

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={!user || isLoadingData || !enoughTokensToStakeMinimum}
      dataTest="stakeWidgetObjectButton"
      onClick={handleObjection}
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
