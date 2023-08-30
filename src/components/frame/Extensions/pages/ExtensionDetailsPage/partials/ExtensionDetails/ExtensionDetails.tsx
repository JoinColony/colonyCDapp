import React, { FC } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';

import { useAppContext, useColonyContext } from '~hooks';

import { isInstalledExtensionData } from '~utils/extensions';

import DeprecateButton from './DeprecateButton';
import UninstallButton from './UninstallButton';
import { addressHasRoles } from '~utils/checks';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

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
