import React from 'react';

import Button from '~shared/Button';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.ActivateButton';

const ActivateButton = () => (
  <Button
    appearance={{
      theme: 'primary',
      size: 'medium',
    }}
    text={{ id: 'button.activate' }}
    //onClick={() => openTokenActivationPopover(true)}
  />
);

ActivateButton.displayName = displayName;

export default ActivateButton;
