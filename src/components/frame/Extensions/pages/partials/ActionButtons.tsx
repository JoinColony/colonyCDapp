import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useColonyContext, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import { useExtensionDetailsPage } from '../ExtensionDetailsPage/hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { ActionButtonProps } from './types';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({ extensionData }) => {
  const {
    handleEnableClick,
    handleInstallClick,
    handleUpdateVersionClick,
    isUpgradeButtonDisabled,
  } = useExtensionDetailsPage(extensionData);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  const isInstallButtonVisible =
    // @ts-ignore
    !isInstalledExtensionData(extensionData);

  const isEnableButtonVisible =
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  const isUpgradeButtonVisible = useMemo(() => {
    if (extensionData && isInstalledExtensionData(extensionData)) {
      return (
        extensionData &&
        extensionData.currentVersion < extensionData.availableVersion
      );
    }
    return false;
  }, [extensionData]);

  if (!colony) {
    return null;
  }

  const isSupportedColonyVersion =
    colony?.version >= MIN_SUPPORTED_COLONY_VERSION;

  return (
    <>
      {isInstallButtonVisible && (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleInstallClick}
          disabled={!isSupportedColonyVersion}
        >
          {formatMessage({ id: 'button.install' })}
        </Button>
      )}
      {isEnableButtonVisible && (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleEnableClick}
          disabled={!isSupportedColonyVersion}
        >
          {formatMessage({ id: 'button.enable' })}
        </Button>
      )}
      {isUpgradeButtonVisible && (
        <Button
          mode="primarySolid"
          isFullSize={isMobile}
          onClick={handleUpdateVersionClick}
          disabled={isUpgradeButtonDisabled}
        >
          {formatMessage({ id: 'button.updateVersion' })}
        </Button>
      )}
    </>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
