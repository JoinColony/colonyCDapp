import {
  type ColonyVersion,
  Extension,
  type ExtensionVersion,
  Id,
  isExtensionCompatible,
  getExtensionLowestCompatibleColonyVersion,
} from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import React, { useCallback, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { CoreAction } from '~actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import ActionButtons from '../partials/ActionButtons.tsx';

import { ExtensionsBadgeMap } from './consts.ts';
import PermissionsNeededBanner from './PermissionsNeededBanner.tsx';

interface ExtensionsTopRowProps {
  extensionData: AnyExtensionData;
  waitingForEnableConfirmation: boolean;
  isSetupRoute: boolean;
  onActiveTabChange: (activeTab: number) => void;
}

const displayName = 'pages.ExtensionDetailsPage.ExtensionTopRow';

const MSG = defineMessages({
  governance: {
    id: `${displayName}.governance`,
    defaultMessage: 'Governance',
  },
  payments: {
    id: `${displayName}.payments`,
    defaultMessage: 'Payments',
  },
  decisionMethod: {
    id: `${displayName}.decisionMethod`,
    defaultMessage: 'Decision method',
  },
  colonyVersionTooLow: {
    id: `${displayName}.colonyVersionTooLow`,
    defaultMessage:
      'This extension requires you to upgrade your colony to version {minimumColonyVersion} or higher before you can start using it.',
  },
  upgradeColony: {
    id: `${displayName}.upgradeColony`,
    defaultMessage: 'Upgrade Colony',
  },
});

// For the time being we can fallback to payments so I don't have to guess what Extension.TokenSupplier would have as a message
const extensionStatusTextMap = {
  [Extension.VotingReputation]: MSG.governance,
  [Extension.MultisigPermissions]: MSG.decisionMethod,
};

const ExtensionsTopRow: FC<ExtensionsTopRowProps> = ({
  extensionData,
  waitingForEnableConfirmation,
  isSetupRoute,
  onActiveTabChange,
}) => {
  const { colony } = useColonyContext();
  const { show } = useActionSidebarContext();

  // @ts-expect-error address will be undefined if the extension hasn't been installed / initialized yet
  const { neededColonyPermissions, address, isInitialized, isDeprecated } =
    extensionData;

  // If the extension itself doesn't have the correct permissions, show the banner
  const showPermissionsBanner =
    isInitialized &&
    !isDeprecated &&
    !addressHasRoles({
      requiredRolesDomain: Id.RootDomain,
      colony,
      requiredRoles: neededColonyPermissions,
      address: address || '',
    });

  const extensionCompatible = isExtensionCompatible(
    extensionData.extensionId,
    extensionData.availableVersion as ExtensionVersion,
    colony.version as ColonyVersion,
  );

  const minimumColonyVersion = getExtensionLowestCompatibleColonyVersion(
    extensionData.extensionId,
    extensionData.availableVersion as ExtensionVersion,
  );

  const handleUpgradeColony = useCallback(
    () =>
      show({
        [ACTION_TYPE_FIELD_NAME]: CoreAction.VersionUpgrade,
      }),
    [show],
  );

  return (
    <>
      {!extensionCompatible && (
        <div className="pb-6">
          <NotificationBanner
            status="error"
            icon={WarningCircle}
            callToAction={
              <button type="button" onClick={handleUpgradeColony}>
                {formatText(MSG.upgradeColony)}
              </button>
            }
          >
            {formatText(MSG.colonyVersionTooLow, {
              minimumColonyVersion,
            })}
          </NotificationBanner>
        </div>
      )}
      {!isSetupRoute && showPermissionsBanner && (
        <PermissionsNeededBanner extensionData={extensionData} />
      )}
      <div className="flex flex-col flex-wrap justify-between sm:h-10 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6">
          <ActionButtons
            onActiveTabChange={onActiveTabChange}
            waitingForEnableConfirmation={waitingForEnableConfirmation}
            isSetupRoute={isSetupRoute}
            extensionData={extensionData}
            extensionStatusMode={ExtensionsBadgeMap[extensionData.extensionId]}
            extensionStatusText={formatText(
              extensionStatusTextMap[extensionData.extensionId] ?? MSG.payments,
            )}
          />
        </div>
      </div>
    </>
  );
};

ExtensionsTopRow.displayName = displayName;

export default ExtensionsTopRow;
