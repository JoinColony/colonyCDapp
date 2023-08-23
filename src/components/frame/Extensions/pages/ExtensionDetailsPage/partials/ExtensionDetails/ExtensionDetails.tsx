import React, { FC } from 'react';
import { ColonyRole, Id } from '@colony/colony-js';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';

import { useAppContext, useColonyContext } from '~hooks';

import { isInstalledExtensionData } from '~utils/extensions';

import DeprecateButton from './DeprecateButton';
import ReenableButton from './ReenableButton';
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

  /* If deprecated, can be re-enabled */
  const canExtensionBeRenabled = !!(
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );

  /* If installed, can be uninstalled. User needs root permission to uninstall. */
  const canExtensionBeUninstalled = !!(
    hasRootPermission &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable
  );

  return (
    <div>
      <SpecificSidePanel extensionData={extensionData} />
      {canExtensionBeDeprecated && (
        <DeprecateButton extensionData={extensionData} />
      )}
      <div className="mt-6 flex flex-col gap-4">
        {canExtensionBeRenabled && (
          <ReenableButton extensionData={extensionData} />
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
