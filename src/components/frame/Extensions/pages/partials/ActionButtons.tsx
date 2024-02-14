import { ColonyRole, Id } from '@colony/colony-js';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useActiveInstalls from '~hooks/useActiveInstalls.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import ActiveInstalls from './ActiveInstalls.tsx';
import EnableButton from './EnableButton.tsx';
import HeadingIcon from './HeadingIcon.tsx';
import InstallButton from './InstallButton.tsx';
import { type ActionButtonProps } from './types.ts';
import UpgradeButton from './UpgradeButton.tsx';

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
