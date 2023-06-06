import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useMobile } from '~hooks';

import Button from '~shared/Extensions/Button';
import { useExtensionDetailsPage } from '../ExtensionDetailsPage/hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { ActionButtonProps } from './types';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({ extensionData }) => {
  const { handleEnableButtonClick, handleInstallClick } = useExtensionDetailsPage(extensionData);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

  return (
    <div className="sm:ml-4">
      {!isExtensionInstalled && (
        <Button mode="primarySolid" isFullSize={isMobile} onClick={handleInstallClick}>
          <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
        </Button>
      )}
      {typeof extensionData?.isInitialized !== 'undefined' && !extensionData?.isInitialized && (
        <Button mode="primarySolid" isFullSize={isMobile} onClick={handleEnableButtonClick}>
          <p className="text-sm font-medium">{formatMessage({ id: 'extension.enableButton' })}</p>
        </Button>
      )}
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
