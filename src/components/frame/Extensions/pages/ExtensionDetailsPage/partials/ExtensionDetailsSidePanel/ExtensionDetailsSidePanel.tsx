import React, { type FC } from 'react';

import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/index.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import DeprecateButton from './DeprecateButton.tsx';
import { type ExtensionDetailsSidePanelProps } from './types.ts';
import UninstallButton from './UninstallButton.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetailsSidePanel';

const ExtensionDetailsSidePanel: FC<ExtensionDetailsSidePanelProps> = ({
  className,
}) => {
  const { extensionData, userHasRoot } = useExtensionDetailsPageContext();

  /* If enabled, can be deprecated */
  const canExtensionBeDeprecated =
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isEnabled &&
    !extensionData.isDeprecated;

  /* If installed, and deprecated / unenabled, can be uninstalled. User needs root permission to uninstall. */
  const canExtensionBeUninstalled = !!(
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    (extensionData.isDeprecated || !extensionData.isEnabled) &&
    extensionData.uninstallable
  );

  return (
    <div className={className}>
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

ExtensionDetailsSidePanel.displayName = displayName;

export default ExtensionDetailsSidePanel;
