import { Extension } from '@colony/colony-js';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { useMobile } from '~hooks/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { getDefaultStakeFraction } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { useInstall } from './hooks.tsx';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({ extensionData }: InstallButtonProps) => {
  const {
    colony: { colonyAddress, nativeToken },
    isSupportedColonyVersion,
  } = useColonyContext();
  const { isPendingManagement } = useExtensionDetailsPageContext();

  const isMobile = useMobile();

  const { handleInstallSuccess, handleInstallError, isLoading } =
    useInstall(extensionData);

  const getDefaultExtensionParams = (extensionId: Extension) => {
    switch (extensionId) {
      case Extension.StakedExpenditure: {
        return {
          stakeFraction: getDefaultStakeFraction(nativeToken.decimals),
        };
      }
      default: {
        return {};
      }
    }
  };

  return (
    <ActionButton
      actionType={ActionTypes.EXTENSION_INSTALL_AND_ENABLE}
      isLoading={isLoading}
      values={{
        colonyAddress,
        extensionData,
        defaultParams: getDefaultExtensionParams(extensionData.extensionId),
      }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={isPendingManagement || !isSupportedColonyVersion}
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
