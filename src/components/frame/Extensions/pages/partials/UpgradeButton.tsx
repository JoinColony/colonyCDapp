import {
  ColonyVersion,
  Extension,
  ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useColonyContext, useMobile } from '~hooks';

import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import Toast from '~shared/Extensions/Toast/Toast';
import { AnyExtensionData } from '~types';
import { mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button/Button';
import { ButtonProps } from '~v5/shared/Button/types';
import { waitForDbAfterExtensionAction } from '../ExtensionDetailsPage/utils';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData';

interface UpgradeButtonProps {
  extensionData: AnyExtensionData;
}

const UpgradeButton = ({ extensionData }: UpgradeButtonProps) => {
  const { colony, isSupportedColonyVersion } = useColonyContext();
  const isMobile = useMobile();
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isPolling, setIsPolling] = useState(false);
  const [isUpgradeDisabled, setIsUpgradeDisabled] = useState(false);

  const { colonyAddress = '' } = colony || {};

  const transformUpgrade = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    extensionId: extensionData.extensionId,
    version: extensionData.availableVersion,
  }));

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony?.version as ColonyVersion,
  );
  const isUpgradeButtonDisabled =
    !isSupportedColonyVersion || !extensionCompatible || isUpgradeDisabled;

  const handleUpgradeSuccess = async () => {
    setIsUpgradeDisabled(true);
    setIsPolling(true);
    await waitForDbAfterExtensionAction({
      method: ExtensionMethods.UPGRADE,
      refetchExtensionData,
      latestVersion: extensionData.availableVersion,
    });
    setIsPolling(false);
    toast.success(
      <Toast
        type="success"
        title={{ id: 'extensionUpgrade.toast.title.success' }}
        description={{
          id: 'extensionUpgrade.toast.description.success',
        }}
      />,
    );
  };

  const handleUpgradeError = () => {
    setIsUpgradeDisabled(false);
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionUpgrade.toast.title.error' }}
        description={{ id: 'extensionUpgrade.toast.description.error' }}
      />,
    );
  };
  return (
    <ActionButton<ButtonProps>
      actionType={ActionTypes.EXTENSION_UPGRADE}
      values={{ colonyAddress, extensionData }}
      transform={transformUpgrade}
      onSuccess={handleUpgradeSuccess}
      onError={handleUpgradeError}
      isLoading={isPolling}
      button={Button}
      buttonProps={{
        mode: 'primarySolid',
        isFullSize: isMobile,
        disabled: isUpgradeButtonDisabled,
        children: formatText({ id: 'button.updateVersion' }),
      }}
    />
  );
};

export default UpgradeButton;
