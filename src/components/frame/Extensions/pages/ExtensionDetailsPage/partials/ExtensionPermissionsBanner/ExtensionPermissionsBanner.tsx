import React, { useState } from 'react';

import { type AnyExtensionData } from '~types/extensions.ts';

import PermissionsEnabledBanner from './PermissionsEnabledBanner.tsx';
import PermissionsNeededBanner from './PermissionsNeededBanner.tsx';

const displayName =
  'frame.Extensions.ExtensionDetailsPage.ExtensionPermissionsBanner';

interface Props {
  extensionData: AnyExtensionData;
  isPermissionsBannerVisible: boolean;
}

const ExtensionPermissionsBanner = ({
  extensionData,
  isPermissionsBannerVisible,
}: Props) => {
  const [hasSuccessfullyEnabled, setHasSuccessfullyEnabled] = useState(false);

  if (hasSuccessfullyEnabled) {
    return <PermissionsEnabledBanner />;
  }

  if (isPermissionsBannerVisible) {
    return (
      <PermissionsNeededBanner
        extensionData={extensionData}
        setHasSuccessfullyEnabled={setHasSuccessfullyEnabled}
      />
    );
  }

  return null;
};

ExtensionPermissionsBanner.displayName = displayName;

export default ExtensionPermissionsBanner;
