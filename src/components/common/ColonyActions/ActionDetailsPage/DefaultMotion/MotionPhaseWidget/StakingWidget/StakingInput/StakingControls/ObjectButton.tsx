import React from 'react';
import { useObjectButton } from '~hooks';

import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  const { handleObjection, disabled } = useObjectButton();

  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={disabled}
      onClick={handleObjection}
      dataTest="stakeWidgetObjectButton"
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
