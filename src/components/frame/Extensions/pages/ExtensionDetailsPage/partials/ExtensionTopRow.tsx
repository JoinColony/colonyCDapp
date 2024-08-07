import { Extension, Id } from '@colony/colony-js';
import React, { useState, type FC } from 'react';
import { useLocation } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';

import { ExtensionsBadgeMap } from '../consts.ts';
import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';

import ActionButtons from './ActionButtons/ActionButtons.tsx';
import PermissionsNeededBanner from './PermissionsNeededBanner.tsx';

interface ExtensionsTopRowProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionTopRow';

const ExtensionsTopRow: FC<ExtensionsTopRowProps> = ({ extensionData }) => {
  const { colony } = useColonyContext();
  const { pathname } = useLocation();
  const { setWaitingForActionConfirmation, waitingForActionConfirmation } =
    useExtensionDetailsPageContext();
  const [isEnabling, setIsEnabling] = useState(false);

  const isSetupRoute = pathname.split('/').pop() === 'setup';

  const { neededColonyPermissions, isInitialized, isDeprecated } =
    extensionData;

  const isVotingReputationExtension =
    extensionData.extensionId === Extension.VotingReputation;

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  // If the extension itself doesn't have the correct permissions, show the banner
  const showPermissionsBanner =
    isExtensionInstalled &&
    isInitialized &&
    !isDeprecated &&
    !addressHasRoles({
      requiredRolesDomain: Id.RootDomain,
      colony,
      requiredRoles: neededColonyPermissions,
      address: extensionData.address,
    });

  return (
    <>
      {!isSetupRoute && !isEnabling && showPermissionsBanner && (
        <PermissionsNeededBanner extensionData={extensionData} />
      )}
      <div className="flex min-h-10 flex-col flex-wrap justify-between sm:flex-row sm:items-center sm:gap-6">
        <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6">
          <ActionButtons
            waitingForActionConfirmation={waitingForActionConfirmation}
            setWaitingForActionConfirmation={setWaitingForActionConfirmation}
            isSetupRoute={isSetupRoute}
            setIsEnabling={setIsEnabling}
            extensionData={extensionData}
            extensionStatusMode={ExtensionsBadgeMap[extensionData.extensionId]}
            extensionStatusText={formatText({
              id: isVotingReputationExtension
                ? 'status.governance'
                : 'status.payments',
            })}
          />
        </div>
      </div>
    </>
  );
};

ExtensionsTopRow.displayName = displayName;

export default ExtensionsTopRow;
