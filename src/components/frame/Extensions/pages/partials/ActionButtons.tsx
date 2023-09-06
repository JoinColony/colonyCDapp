import React, { FC } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

import { useActiveInstalls, useAppContext, useColonyContext } from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ActionButtonProps } from './types';
import HeadingIcon from './HeadingIcon';
import ActiveInstalls from './ActiveInstalls';
import InstallButton from './InstallButton';
import { addressHasRoles } from '~utils/checks';
import UpgradeButton from './UpgradeButton';
import EnableButton from './EnableButton';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({
  extensionData,
  isSetupRoute,
  waitingForEnableConfirmation,
  extensionStatusMode,
  extensionStatusText,
}) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const activeInstalls = useActiveInstalls(extensionData.extensionId);

  if (!colony) {
    return null;
  }

  const userHasRoot =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomains: [Id.RootDomain],
    });

  /* To install, a user must have the root permission. */
  const isInstallButtonVisible =
    userHasRoot &&
    !isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  const isUpgradeButtonVisible =
    !!user &&
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.currentVersion < extensionData.availableVersion;

  return (
    <>
      <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
        <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
        <div className="flex justify-between items-center mt-4 sm:mt-0 gap-4 sm:grow sm:shrink-0">
          <ExtensionStatusBadge
            mode={extensionStatusMode}
            text={extensionStatusText}
          />
          <ActiveInstalls activeInstalls={activeInstalls} />
        </div>
      </div>
      {isInstallButtonVisible && (
        <InstallButton extensionData={extensionData} />
      )}
      <EnableButton
        extensionData={extensionData}
        isSetupRoute={isSetupRoute}
        userHasRoot={userHasRoot}
        waitingForEnableConfirmation={waitingForEnableConfirmation}
      />
      {isUpgradeButtonVisible && (
        <UpgradeButton extensionData={extensionData} />
      )}
    </>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
