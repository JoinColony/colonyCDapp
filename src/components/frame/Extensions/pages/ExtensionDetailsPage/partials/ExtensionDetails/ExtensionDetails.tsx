import { ColonyRole, Id } from '@colony/colony-js';
import React, { FC } from 'react';

import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/index.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { addressHasRoles } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import DeprecateButton from './DeprecateButton.tsx';
import { ExtensionDetailsProps } from './types.ts';
import UninstallButton from './UninstallButton.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const hasRootPermission =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomains: [Id.RootDomain],
    });

  /* If enabled, can be deprecated */
  const canExtensionBeDeprecated =
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isEnabled &&
    !extensionData.isDeprecated;

  /* If installed, and deprecated / unenabled, can be uninstalled. User needs root permission to uninstall. */
  const canExtensionBeUninstalled = !!(
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    (extensionData.isDeprecated || !extensionData.isEnabled) &&
    extensionData.uninstallable
  );

  return (
    <div>
      <SpecificSidePanel extensionData={extensionData} />
      <div className="mt-6">
        {canExtensionBeDeprecated && (
          <DeprecateButton extensionData={extensionData} />
        )}
        {canExtensionBeUninstalled && (
          <UninstallButton extensionData={extensionData} />
        )}
      </div>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
