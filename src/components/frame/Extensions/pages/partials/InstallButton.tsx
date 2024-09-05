import {
  type ColonyVersion,
  Extension,
  type ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import {
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
} from '~routes/index.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import {
  ExtensionTabId,
  waitForDbAfterExtensionAction,
} from '../ExtensionDetailsPage/utils.tsx';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
  onActiveTabChange: (activeTab: number) => void;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({
  extensionData,
  onActiveTabChange,
}: InstallButtonProps) => {
  const {
    colony: { colonyAddress, name: colonyName, version: colonyVersion },
    isSupportedColonyVersion,
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isInstallDisabled, setIsInstallDisabled] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();
  const extensionCompatible = isExtensionCompatible(
    extensionData.extensionId,
    extensionData.availableVersion as ExtensionVersion,
    colonyVersion as ColonyVersion,
  );

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
    // @TODO will need to do the same for Extension.VotingReputation
    if (extensionData.extensionId === Extension.MultisigPermissions) {
      onActiveTabChange(ExtensionTabId.SETTINGS);
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
      useTxLoader
      actionType={ActionTypes.EXTENSION_INSTALL}
      isLoading={isPolling}
      values={{ colonyAddress, extensionData }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={
        isInstallDisabled || !isSupportedColonyVersion || !extensionCompatible
      }
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
