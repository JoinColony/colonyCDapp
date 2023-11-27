import React from 'react';

import { useTokenActivationContext } from '~hooks';
import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.DefaultMotion.StakingWidget.StakingControls.ActivateButton';

const ActivateButton = () => {
  const { setIsOpen } = useTokenActivationContext();
  return (
    <Button
      appearance={{
        theme: 'primary',
        size: 'medium',
      }}
      text={{ id: 'button.activate' }}
      onClick={() => setIsOpen(true)}
    />
  );
};

ActivateButton.displayName = displayName;

export default ActivateButton;
