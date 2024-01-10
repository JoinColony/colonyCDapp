import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { COLONY_EXTENSIONS_ROUTE, COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { ActionButton } from '~shared/Button';
import Button from '~shared/Button/Button';
import { InstalledExtensionData } from '~types';

const displayName =
  'common.Extensions.ExtensionActionButton.ExtensionEnableButton';

const MSG = defineMessages({
  enable: {
    id: `${displayName}.enable`,
    defaultMessage: 'Enable',
  },
});

interface Props {
  extensionData: InstalledExtensionData;
  inputDisabled: boolean;
  stopPolling: () => void;
}

const EnableButton = ({ extensionData, inputDisabled, stopPolling }: Props) => {
  const {
    colony: { colonyAddress, name: colonyName },
  } = useColonyContext();
  const navigate = useNavigate();
  stopPolling();

  const handleEnableButtonClick = () => {
    navigate(
      `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData.extensionId}/${COLONY_EXTENSION_SETUP_ROUTE}`,
    );
  };

  // If extension is not initializable but is missing permissions, show enable extension action button
  if (
    !extensionData.initializationParams &&
    extensionData.missingColonyPermissions.length
  ) {
    return (
      <ActionButton
        text={MSG.enable}
        actionType={ActionTypes.EXTENSION_ENABLE}
        values={{ colonyAddress, extensionData }}
      />
    );
  }

  return (
    <Button
      appearance={{ theme: 'primary', size: 'medium' }}
      onClick={handleEnableButtonClick}
      text={{ id: 'button.enable' }}
      disabled={inputDisabled}
    />
  );
};

EnableButton.displayName = displayName;

export default EnableButton;
