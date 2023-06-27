import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useActiveInstalls, useColonyContext, useMobile } from '~hooks';
import Button from '~v5/shared/Button';
import { useExtensionDetailsPage } from '../ExtensionDetailsPage/hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';
import { ActionButtonProps } from './types';
import HeadingIcon from './HeadingIcon';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import ActiveInstalls from './ActiveInstalls';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({
  extensionData,
  extensionStatusMode,
  extensionStatusText,
}) => {
  const {
    handleInstallClick,
    handleUpdateVersionClick,
    isUpgradeButtonDisabled,
  } = useExtensionDetailsPage(extensionData);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  const isSupportedColonyVersion =
    colony?.version ?? MIN_SUPPORTED_COLONY_VERSION <= 0;

  const isInstallButtonVisible =
    // @ts-ignore
    !isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    // @ts-ignore
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

  const activeInstalls = useActiveInstalls(extensionData.extensionId);

  return (
    <>
      <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
        <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
        <div className="flex justify-between items-center w-full mt-4 sm:mt-0 gap-4">
          <ExtensionStatusBadge
            mode={extensionStatusMode}
            text={extensionStatusText}
          />
          <ActiveInstalls activeInstalls={activeInstalls} />
        </div>
      </div>
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
