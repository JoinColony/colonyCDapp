// import { ColonyRole, Id } from '@colony/colony-js';
import React, { type FC } from 'react';

// import { useAppContext } from '~context/AppContext/AppContext.ts';
// import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
// import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
// import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
// import useActiveInstalls from '~hooks/useActiveInstalls.ts';
// import { addressHasRoles } from '~utils/checks/index.ts';
// import { isInstalledExtensionData } from '~utils/extensions.ts';
import useActiveInstalls from '~hooks/useActiveInstalls.ts';
import { formatText } from '~utils/intl.ts';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';

import ActiveInstalls from './ActiveInstalls.tsx';
// import EnableButton from '../EnableButton.tsx';
import { extensionsBadgeModeMap, extensionsBadgeTextMap } from './consts.ts';
import HeadingIcon from './HeadingIcon.tsx';
// import InstallButton from '../InstallButton.tsx';
// import SaveChangesButton from '../SaveChangesButton.tsx';
// import UpgradeButton from '../UpgradeButton.tsx';

interface ExtensionDetailsHeadingProps {
  extensionData: any;
  // isSetupRoute: boolean;
  // extensionStatusMode: any;
  // extensionStatusText: string;
}

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ExtensionDetailsHeading: FC<ExtensionDetailsHeadingProps> = ({
  extensionData,
  // extensionStatusText,
}) => {
  // const { user } = useAppContext();
  // const { colony } = useColonyContext();
  // const { activeTab } = useExtensionDetailsPageContext();

  const activeInstalls = useActiveInstalls(extensionData.extensionId);

  // const userHasRoot =
  //   !!user &&
  //   addressHasRoles({
  //     address: user.walletAddress,
  //     colony,
  //     requiredRoles: [ColonyRole.Root],
  //     requiredRolesDomain: Id.RootDomain,
  //   });

  // /* To install, a user must have the root permission. */
  // const isInstallButtonVisible =
  //   userHasRoot &&
  //   !isInstalledExtensionData(extensionData) &&
  //   extensionData.uninstallable &&
  //   !extensionData.isDeprecated;

  // /* To save changes, a user must have the root permission. */
  // const isSaveChangesButtonVisible =
  //   userHasRoot &&
  //   isInstalledExtensionData(extensionData) &&
  //   extensionData.enabledAutomaticallyAfterInstall &&
  //   activeTab === ExtensionDetailsPageTabId.Settings;

  // const isUpgradeButtonVisible =
  //   !!user &&
  //   extensionData &&
  //   isInstalledExtensionData(extensionData) &&
  //   extensionData.currentVersion < extensionData.availableVersion;

  return (
    <>
      <div className="flex flex-col sm:grow sm:flex-row sm:items-center sm:gap-2">
        <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
        <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:shrink-0 sm:grow">
          <ExtensionStatusBadge
            mode={extensionsBadgeModeMap[extensionData.extensionId]}
            text={formatText({
              id: extensionsBadgeTextMap[extensionData.extensionId],
            })}
          />
          <ActiveInstalls activeInstalls={activeInstalls} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        {/* <InstallButton
          extensionData={extensionData}
          isVisible={isInstallButtonVisible}
        />
        <EnableButton
          extensionData={extensionData}
          isSetupRoute={isSetupRoute}
          userHasRoot={userHasRoot}
        />
        {isSaveChangesButtonVisible && <SaveChangesButton />}
        {isUpgradeButtonVisible && (
          <UpgradeButton extensionData={extensionData} />
        )} */}
      </div>
    </>
  );
};

ExtensionDetailsHeading.displayName = displayName;

export default ExtensionDetailsHeading;
