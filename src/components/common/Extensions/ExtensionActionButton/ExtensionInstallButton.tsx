import React, { useState } from 'react';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton, IconButton } from '~shared/Button';
import { InstallableExtensionData } from '~types';

interface Props {
  extensionData: InstallableExtensionData;
  startPolling: (interval: number) => void;
  inputDisabled: boolean;
}

const InstallButton = ({
  extensionData,
  startPolling,
  inputDisabled,
}: Props) => {
  const { colony } = useColonyContext();
  const [disableInstall, setDisableInstall] = useState(inputDisabled);

  if (!colony) {
    return null;
  }

  const handleInstallSuccess = () => {
    startPolling(1000);
    setDisableInstall(true);
  };

  return (
    <ActionButton
      button={IconButton}
      actionType={ActionTypes.EXTENSION_INSTALL}
      values={{
        colonyAddress: colony.colonyAddress,
        extensionData,
      }}
      text={{ id: 'button.install' }}
      disabled={disableInstall}
      onSuccess={handleInstallSuccess}
    />
  );
};

export default InstallButton;
