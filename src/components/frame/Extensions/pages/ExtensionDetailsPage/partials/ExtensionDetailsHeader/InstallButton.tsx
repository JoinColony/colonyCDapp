import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { useInstall } from './hooks.tsx';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({ extensionData }: InstallButtonProps) => {
  const {
    colony: { colonyAddress },
    isSupportedColonyVersion,
  } = useColonyContext();

  const isMobile = useMobile();

  const { isLoading, handleInstallSuccess, handleInstallError } =
    useInstall(extensionData);

  return (
    <ActionButton
      actionType={ActionTypes.EXTENSION_INSTALL}
      isLoading={isLoading}
      values={{ colonyAddress, extensionData }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={!isSupportedColonyVersion}
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
