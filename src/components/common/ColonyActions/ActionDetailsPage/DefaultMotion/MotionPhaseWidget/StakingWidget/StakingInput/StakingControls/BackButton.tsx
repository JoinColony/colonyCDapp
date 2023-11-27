import React from 'react';

import Button from '~shared/Button';
import { useStakingWidgetContext } from '../../StakingWidgetProvider';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.BackButton';

const BackButton = () => {
  const { setIsSummary } = useStakingWidgetContext();
  return (
    <Button
      appearance={{ theme: 'secondary', size: 'medium' }}
      text={{ id: 'button.back' }}
      onClick={() => setIsSummary(true)}
    />
  );
};

BackButton.displayName = displayName;

export default BackButton;
