import React from 'react';

import Button from '~shared/Button';
import { useObjectButton } from '~hooks';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  const { handleObjection, canUserStakedNay } = useObjectButton();

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={!canUserStakedNay}
      dataTest="stakeWidgetObjectButton"
      onClick={handleObjection}
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
