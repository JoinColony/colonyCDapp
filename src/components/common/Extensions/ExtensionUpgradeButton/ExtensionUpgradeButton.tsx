import React, { useCallback } from 'react';

import {
  Extension,
  ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import { ActionButton } from '~shared/Button';
import { AnyExtensionData } from '~types';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { isInstalledExtensionData } from '~utils/extensions';
import { useAppContext, useColonyContext } from '~hooks';

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionUpgradeButton = ({ extensionData }: Props) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const transform = useCallback(
    mapPayload(() => ({
      colonyAddress: colony?.colonyAddress,
      extensionId: extensionData.extensionId,
      version: extensionData.availableVersion + 1,
    })),
    [],
  );

  // const isSupportedColonyVersion =
  //   parseInt(colonyVersion || '1', 10) >= ColonyVersion.LightweightSpaceship;
  const isSupportedColonyVersion = true;

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    10,
  );

  if (!user?.profile) {
    return null;
  }

  const canInstall = !isInstalledExtensionData(extensionData);

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      submit={ActionTypes.EXTENSION_UPGRADE}
      error={ActionTypes.EXTENSION_UPGRADE_ERROR}
      success={ActionTypes.EXTENSION_UPGRADE_SUCCESS}
      transform={transform}
      text={{ id: 'button.upgrade' }}
      disabled={
        !isSupportedColonyVersion || !extensionCompatible || !canInstall
      }
    />
  );
};

export default ExtensionUpgradeButton;
