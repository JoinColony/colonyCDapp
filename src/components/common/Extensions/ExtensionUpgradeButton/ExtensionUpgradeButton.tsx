import {
  ColonyVersion,
  Extension,
  ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux/index';
import { ActionButton } from '~shared/Button';
import { getAllUserRoles } from '~transformers';
import { AnyExtensionData } from '~types';
import { mapPayload } from '~utils/actions';
import { hasRoot } from '~utils/checks';
import { isInstalledExtensionData } from '~utils/extensions';

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionUpgradeButton = ({ extensionData }: Props) => {
  const { colony, isSupportedColonyVersion } = useColonyContext();
  const { user } = useAppContext();

  if (
    !isInstalledExtensionData(extensionData) ||
    extensionData.currentVersion >= extensionData.availableVersion
  ) {
    return null;
  }

  const transform = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    extensionId: extensionData.extensionId,
    version: extensionData.availableVersion,
  }));

  if (!user?.profile || !colony) {
    return null;
  }

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony.version as ColonyVersion,
  );

  if (!user || extensionData.isDeprecated || !extensionData.isInitialized) {
    return null;
  }
  const canUpgrade = hasRoot(getAllUserRoles(colony, user.walletAddress));

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      actionType={ActionTypes.EXTENSION_UPGRADE}
      transform={transform}
      text={{ id: 'button.upgrade' }}
      disabled={
        !isSupportedColonyVersion || !extensionCompatible || !canUpgrade
      }
    />
  );
};

export default ExtensionUpgradeButton;
