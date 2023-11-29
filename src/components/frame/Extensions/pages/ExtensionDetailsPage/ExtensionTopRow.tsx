import React, { FC } from 'react';
import { Extension, Id } from '@colony/colony-js';
import ActionButtons from '../partials/ActionButtons';

import { AnyExtensionData } from '~types';
import { addressHasRoles } from '~utils/checks';
import PermissionsNeededBanner from './PermissionsNeededBanner';
import { ExtensionsBadgeMap } from './consts';
import { formatText } from '~utils/intl';
import useColonyContext from '~hooks/useColonyContext';

import styles from '../Pages.module.css';

interface ExtensionsTopRowProps {
  extensionData: AnyExtensionData;
  waitingForEnableConfirmation: boolean;
  isSetupRoute: boolean;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionTopRow';

const ExtensionsTopRow: FC<ExtensionsTopRowProps> = ({
  extensionData,
  waitingForEnableConfirmation,
  isSetupRoute,
}) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const {
    neededColonyPermissions,
    // address will be undefined if the extension hasn't been installed / initialized yet
    // @ts-expect-error
    address,
    isInitialized,
    isDeprecated,
  } = extensionData;

  const isVotingReputationExtension =
    extensionData.extensionId === Extension.VotingReputation;

  // If the extension itself doesn't have the correct permissions, show the banner
  const showPermissionsBanner =
    isInitialized &&
    !isDeprecated &&
    !addressHasRoles({
      requiredRolesDomains: [Id.RootDomain],
      colony,
      requiredRoles: neededColonyPermissions,
      address,
    });

  return (
    <>
      {!isSetupRoute && showPermissionsBanner && (
        <PermissionsNeededBanner extensionData={extensionData} />
      )}
      <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
        <div className={styles.topContainer}>
          <ActionButtons
            waitingForEnableConfirmation={waitingForEnableConfirmation}
            isSetupRoute={isSetupRoute}
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
