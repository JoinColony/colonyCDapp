import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useColonyContext, useMobile } from '~hooks';

import Button from '~shared/Extensions/Button';
import { useExtensionDetailsPage } from '../ExtensionDetailsPage/hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';
import { ActionButtonsProps } from '../LazyConsensusPage/types';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ extensionData }) => {
  const { handleEnableButtonClick, handleInstallClick } = useExtensionDetailsPage();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  const isSupportedColonyVersion = colony?.version ?? MIN_SUPPORTED_COLONY_VERSION <= 0;

  const isInstallButtonVisible =
    // @ts-ignore
    !isInstalledExtensionData(extensionData) && extensionData.uninstallable && !extensionData.isDeprecated;

  const isEnableButtonVisible =
    isInstalledExtensionData(extensionData) && extensionData.uninstallable && !extensionData.isDeprecated;

  return (
    <div className="sm:ml-4 flex gap-2">
      {isInstallButtonVisible && (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleInstallClick}
          disabled={!isSupportedColonyVersion}
        >
          <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
        </Button>
      )}
      {isEnableButtonVisible && (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleEnableButtonClick}
          disabled={!isSupportedColonyVersion}
        >
          <p className="text-sm font-medium">{formatMessage({ id: 'extension.enableButton' })}</p>
        </Button>
      )}
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
