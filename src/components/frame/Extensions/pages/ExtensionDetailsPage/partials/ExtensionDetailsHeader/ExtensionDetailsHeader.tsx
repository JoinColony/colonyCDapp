import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import useActiveInstalls from '~hooks/useActiveInstalls.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import ExtensionPermissionsBanner from '../ExtensionPermissionsBanner/ExtensionPermissionsBanner.tsx';

import ActiveInstalls from './ActiveInstalls.tsx';
import { extensionsBadgeModeMap, extensionsBadgeTextMap } from './consts.ts';
import HeadingIcon from './HeadingIcon.tsx';
import InstallButton from './InstallButton.tsx';
import ReenableButton from './ReenableButton.tsx';
import SubmitButton from './SubmitButton.tsx';
import UpgradeButton from './UpgradeButton.tsx';

const displayName = 'pages.ExtensionDetailsPage.ExtensionDetailsHeader';

const ExtensionDetailsHeader: FC = () => {
  const { user } = useAppContext();
  const { extensionData, userHasRoot, isPendingManagement } =
    useExtensionDetailsPageContext();

  const activeInstalls = useActiveInstalls(extensionData.extensionId);

  // /* To install, a user must have the root permission. */
  const isInstallButtonVisible =
    userHasRoot && !isInstalledExtensionData(extensionData);

  const isReenableButtonVisible =
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    extensionData.isDeprecated;

  const isUpgradeButtonVisible =
    !!user &&
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.currentVersion < extensionData.availableVersion;

  const badgeMode = extensionsBadgeModeMap[extensionData.extensionId];
  const badgeText = extensionsBadgeTextMap[extensionData.extensionId];

  const isPermissionsBannerVisible =
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    extensionData.isEnabled &&
    extensionData.missingColonyPermissions.length > 0 &&
    !isPendingManagement;

  return (
    <>
      <ExtensionPermissionsBanner
        extensionData={extensionData}
        isPermissionsBannerVisible={isPermissionsBannerVisible}
      />
      <div className="flex min-h-10 flex-col flex-wrap justify-between sm:flex-row sm:items-center sm:gap-6">
        <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6">
          <div className="flex flex-col sm:grow sm:flex-row sm:items-center sm:gap-2">
            <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
            <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:shrink-0 sm:grow">
              {badgeMode && badgeText && (
                <ExtensionStatusBadge
                  mode={extensionsBadgeModeMap[extensionData.extensionId]}
                  text={formatText({
                    id: extensionsBadgeTextMap[extensionData.extensionId],
                  })}
                />
              )}
              <ActiveInstalls activeInstalls={activeInstalls} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {isInstallButtonVisible && (
              <InstallButton extensionData={extensionData} />
            )}
            {isReenableButtonVisible && (
              <ReenableButton extensionData={extensionData} />
            )}
            {isUpgradeButtonVisible && (
              <UpgradeButton extensionData={extensionData} />
            )}
            <SubmitButton
              extensionData={extensionData}
              userHasRoot={userHasRoot}
            />
          </div>
        </div>
      </div>
    </>
  );
};

ExtensionDetailsHeader.displayName = displayName;

export default ExtensionDetailsHeader;
