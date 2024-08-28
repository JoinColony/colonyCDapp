import { ColonyRole, Id } from '@colony/colony-js';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useActiveInstalls from '~hooks/useActiveInstalls.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import { useExtensionDetailsPageContext } from '../../context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '../../types.ts';
import ActiveInstalls from '../ActiveInstalls/ActiveInstalls.tsx';
import EnableButton from '../EnableButton.tsx';
import HeadingIcon from '../HeadingIcon/HeadingIcon.tsx';
import InstallButton from '../InstallButton.tsx';
import SaveChangesButton from '../SaveChangesButton.tsx';
import UpgradeButton from '../UpgradeButton.tsx';

import { type ActionButtonProps } from './types.ts';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({
  extensionData,
  isSetupRoute,
  extensionStatusMode,
  extensionStatusText,
  setIsEnabling,
}) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { activeTab } = useExtensionDetailsPageContext();

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

  /* To save changes, a user must have the root permission. */
  const isSaveChangesButtonVisible =
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    extensionData.enabledAutomaticallyAfterInstall &&
    activeTab === ExtensionDetailsPageTabId.Settings;

  const isUpgradeButtonVisible =
    !!user &&
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.currentVersion < extensionData.availableVersion;

  return (
    <>
      <div className="flex flex-col sm:grow sm:flex-row sm:items-center sm:gap-2">
        <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
        <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:shrink-0 sm:grow">
          <ExtensionStatusBadge
            mode={extensionStatusMode}
            text={extensionStatusText}
          />
          <ActiveInstalls activeInstalls={activeInstalls} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <InstallButton
          extensionData={extensionData}
          isVisible={isInstallButtonVisible}
          setIsEnabling={setIsEnabling}
        />
        <EnableButton
          extensionData={extensionData}
          isSetupRoute={isSetupRoute}
          userHasRoot={userHasRoot}
        />
        {isSaveChangesButtonVisible && <SaveChangesButton />}
        {isUpgradeButtonVisible && (
          <UpgradeButton extensionData={extensionData} />
        )}
      </div>
    </>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
