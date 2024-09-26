import {
  type ColonyVersion,
  Extension,
  type ExtensionVersion,
  isExtensionCompatible,
} from '@colony/colony-js';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import { useMobile } from '~hooks/index.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import { mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

interface UpgradeButtonProps {
  extensionData: AnyExtensionData;
}

const UpgradeButton = ({ extensionData }: UpgradeButtonProps) => {
  const {
    colony: { colonyAddress, version: colonyVersion },
    isSupportedColonyVersion,
  } = useColonyContext();
  const isMobile = useMobile();
  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isPolling, setIsPolling] = useState(false);
  const [isUpgradeDisabled, setIsUpgradeDisabled] = useState(false);

  const transformUpgrade = mapPayload(() => ({
    colonyAddress,
    extensionId: extensionData.extensionId,
    version: extensionData.availableVersion,
  }));

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colonyVersion as ColonyVersion,
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
    <ActionButton
      actionType={ActionTypes.EXTENSION_UPGRADE}
      values={{ colonyAddress, extensionData }}
      transform={transformUpgrade}
      onSuccess={handleUpgradeSuccess}
      onError={handleUpgradeError}
      isLoading={isPolling}
      isFullSize={isMobile}
      disabled={isUpgradeButtonDisabled}
    >
      {formatText({ id: 'button.updateVersion' })}
    </ActionButton>
  );
};

export default UpgradeButton;
