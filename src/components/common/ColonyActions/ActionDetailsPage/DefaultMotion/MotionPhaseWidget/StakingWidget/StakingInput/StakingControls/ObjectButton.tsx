import React from 'react';

import Button from '~shared/Button';
import { useObjectButton } from '~hooks';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ObjectButton';

const ObjectButton = () => {
  const { handleObjection } = useObjectButton();
  return (
    <Button
      appearance={{ theme: 'pink', size: 'medium' }}
      text={{ id: 'button.object' }}
      disabled={false}
      dataTest="stakeWidgetObjectButton"
      onClick={handleObjection}
    />
  );
};

ObjectButton.displayName = displayName;

export default ObjectButton;
