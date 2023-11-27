import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Extension } from '@colony/colony-js';

import { useColonyContext, useExtensionData, useMobile } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import Toast from '~shared/Extensions/Toast/Toast';
import { AnyExtensionData } from '~types';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button/Button';
import { waitForDbAfterExtensionAction } from '../ExtensionDetailsPage/utils';
import { ExtensionMethods } from '~hooks/useExtensionData';
import { COLONY_EXTENSIONS_ROUTE, COLONY_EXTENSION_SETUP_ROUTE } from '~routes';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({ extensionData }: InstallButtonProps) => {
  const { colony, isSupportedColonyVersion } = useColonyContext();
  const { colonyAddress = '', name: colonyName = '' } = colony ?? {};
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isInstallDisabled, setIsInstallDisabled] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMobile();

  const handleInstallSuccess = async () => {
    setIsInstallDisabled(true);
    setIsPolling(true);
    await waitForDbAfterExtensionAction({
      method: ExtensionMethods.INSTALL,
      refetchExtensionData,
    });
    setIsPolling(false);
    toast.success(
      <Toast
        type="success"
        title={{ id: 'extensionInstall.toast.title.success' }}
        description={{
          id: 'extensionInstall.toast.description.success',
        }}
      />,
    );
    if (extensionData.extensionId === Extension.VotingReputation) {
      navigate(
        `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData?.extensionId}/${COLONY_EXTENSION_SETUP_ROUTE}`,
      );
    }
  };

  const handleInstallError = () => {
    setIsInstallDisabled(false);
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionInstall.toast.title.error' }}
        description={{ id: 'extensionInstall.toast.description.error' }}
      />,
    );
  };

  return (
    <ActionButton
      actionType={ActionTypes.EXTENSION_INSTALL}
      isLoading={isPolling}
      values={{ colonyAddress, extensionData }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      button={Button}
      buttonProps={{
        mode: 'primarySolid',
        isFullSize: isMobile,
        disabled: isInstallDisabled || !isSupportedColonyVersion,
        children: formatText({ id: 'button.install' }),
      }}
    />
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
