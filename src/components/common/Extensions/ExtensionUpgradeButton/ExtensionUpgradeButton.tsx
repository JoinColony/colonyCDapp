import React, { FC } from 'react';
import { ColonyVersion, Extension, ExtensionVersion, isExtensionCompatible } from '@colony/colony-js';
import { toast } from 'react-toastify';

import { useIntl } from 'react-intl';
import { ActionTypes } from '~redux/index';
import { mapPayload } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { MIN_SUPPORTED_COLONY_VERSION } from '~constants';
import { isInstalledExtensionData } from '~utils/extensions';
import { ExtensionUpgradeButtonProps } from './types';
import ActionButton from '~shared/Extensions/ActionButton';
import Toast from '~shared/Extensions/Toast';

const displayName = 'common.Extensions.ExtensionUpgradeButton';

const ExtensionUpgradeButton: FC<ExtensionUpgradeButtonProps> = ({ extensionData }) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { formatMessage } = useIntl();

  if (!isInstalledExtensionData(extensionData) || extensionData.currentVersion >= extensionData.availableVersion) {
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

  const isSupportedColonyVersion = colony.version >= MIN_SUPPORTED_COLONY_VERSION;

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony.version as ColonyVersion,
  );

  if (!user || extensionData.isDeprecated || !extensionData.isInitialized) {
    return null;
  }

  const canUpgrade = true;

  return (
    <ActionButton
      submit={ActionTypes.EXTENSION_UPGRADE}
      error={ActionTypes.EXTENSION_UPGRADE_ERROR}
      success={ActionTypes.EXTENSION_UPGRADE_SUCCESS}
      transform={transform}
      text={{ id: 'button.updateVersion' }}
      disabled={!isSupportedColonyVersion || !extensionCompatible || !canUpgrade}
      onSuccess={() =>
        toast.success(
          <Toast
            type="success"
            title={formatMessage({ id: 'extensionUpgrade.toast.title.success' })}
            description={formatMessage({ id: 'extensionUpgrade.toast.description.success' })}
          />,
        )
      }
      onError={() =>
        toast.error(
          <Toast
            type="error"
            title={formatMessage({ id: 'extensionUpgrade.toast.title.error' })}
            description={formatMessage({ id: 'extensionUpgrade.toast.description.error' })}
          />,
        )
      }
    />
  );
};

ExtensionUpgradeButton.displayName = displayName;

export default ExtensionUpgradeButton;
