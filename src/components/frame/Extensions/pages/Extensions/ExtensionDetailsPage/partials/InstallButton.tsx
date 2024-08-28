import { Extension } from '@colony/colony-js';
import clsx from 'clsx';
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
import { getDefaultStakeFraction } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import {
  waitForColonyPermissions,
  waitForDbAfterExtensionAction,
} from '../ExtensionDetailsPageContent/utils.tsx';
import { ExtensionDetailsPageTabId } from '../types.ts';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
  isVisible?: boolean;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({
  extensionData,

  isVisible,
}: InstallButtonProps) => {
  const {
    colony: {
      colonyAddress,
      name: colonyName,
      nativeToken: { decimals },
    },
    refetchColony,
    isSupportedColonyVersion,
  } = useColonyContext();
  const { setActiveTab } = useExtensionDetailsPageContext();

  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isInstallDisabled, setIsInstallDisabled] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMobile();

  const handleInstallSuccess = async () => {
    setIsInstallDisabled(true);
    setIsPolling(true);

    try {
      if (extensionData.enabledAutomaticallyAfterInstall) {
        await waitForColonyPermissions({ extensionData, refetchColony });
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        setIsPolling(false);

        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionInstallAndEnable.toast.title.success' }}
            description={{
              id: 'extensionInstallAndEnable.toast.description.success',
            }}
          />,
        );

        setActiveTab(ExtensionDetailsPageTabId.Settings);
      } else {
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
      }

      if (extensionData.extensionId === Extension.VotingReputation) {
        navigate(
          `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData?.extensionId}/${COLONY_EXTENSION_SETUP_ROUTE}`,
        );
      }
    } catch {
      setIsInstallDisabled(false);
      setIsPolling(false);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionInstall.toast.title.error' }}
          description={{ id: 'extensionInstall.toast.description.error' }}
        />,
      );
    } finally {
      setIsInstallDisabled(false);
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
      actionType={ActionTypes.EXTENSION_INSTALL_AND_ENABLE}
      isLoading={isPolling}
      values={{
        colonyAddress,
        extensionData,
        stakeFraction: getDefaultStakeFraction(decimals),
      }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={isInstallDisabled || !isSupportedColonyVersion}
      className={clsx({ hidden: !isVisible })}
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
