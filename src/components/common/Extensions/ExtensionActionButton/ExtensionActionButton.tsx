import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import Button, { ActionButton, IconButton } from '~shared/Button';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';

const displayName = 'common.Extensions.ExtensionActionButton';

const MSG = defineMessages({
  install: {
    id: `${displayName}.install`,
    defaultMessage: 'Install',
  },
  enable: {
    id: `${displayName}.enable`,
    defaultMessage: 'Enable',
  },
});

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionActionButton = ({ extensionData }: Props) => {
  const navigate = useNavigate();
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  if (!colony || !user) {
    return null;
  }

  const handleEnableButtonClick = () => {
    navigate(
      `/colony/${colony.name}/extensions/${extensionData.extensionId}/setup`,
    );
  };

  const isSupportedColonyVersion =
    colony.version >= MIN_SUPPORTED_COLONY_VERSION;

  if (!isInstalledExtensionData(extensionData)) {
    return (
      <ActionButton
        button={IconButton}
        actionType={ActionTypes.EXTENSION_INSTALL}
        values={{
          colonyAddress: colony.colonyAddress,
          extensionData,
        }}
        text={MSG.install}
        disabled={!isSupportedColonyVersion}
      />
    );
  }

  if (extensionData.isDeprecated) {
    return null;
  }

  if (!extensionData.isInitialized) {
    return (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        onClick={handleEnableButtonClick}
        text={MSG.enable}
        disabled={!isSupportedColonyVersion}
      />
    );
  }

  // @TODO: Handle missing permissions

  return null;
};

ExtensionActionButton.displayName = displayName;

export default ExtensionActionButton;
