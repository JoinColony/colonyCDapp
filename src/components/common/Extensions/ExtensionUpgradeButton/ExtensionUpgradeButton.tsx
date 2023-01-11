import React, { useCallback } from 'react';
import {
  Extension,
  ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';

import { ActionButton } from '~shared/Button';
import { InstalledExtensionData } from '~types';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';

interface Props {
  extensionData: InstalledExtensionData;
}

const ExtensionUpgradeButton = ({ extensionData }: Props) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress: colony?.colonyAddress,
      extensionId: extensionData.extensionId,
      version: extensionData.currentVersion + 1,
    })),
    [],
  );

  const isSupportedColonyVersion = (colony?.version || 1) >= 5;

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    10,
  );

  if (!user?.profile) {
    return null;
  }
  // @TODO check user permissions for canUpgrade - hasRoot(allUserRoles)
  const canUpgrade = true;

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      submit={ActionTypes.EXTENSION_UPGRADE}
      error={ActionTypes.EXTENSION_UPGRADE_ERROR}
      success={ActionTypes.EXTENSION_UPGRADE_SUCCESS}
      transform={transform}
      text={{ id: 'button.upgrade' }}
      disabled={
        !isSupportedColonyVersion || !extensionCompatible || !canUpgrade
      }
    />
  );
};

export default ExtensionUpgradeButton;
