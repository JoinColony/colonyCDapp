import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useAppContext, useColonyContext, useExtensionData, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import { isInstalledExtensionData } from '~utils/extensions';
import ExtensionDetails from './partials/ExtensionDetails';
import { useExtensionDetailsPage } from './hooks';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { handleEnableButtonClick, handleInstallClick } = useExtensionDetailsPage();

  if (!colony) {
    return null;
  }

  if (!extensionData) {
    return (
      <div>
        <p>{formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>
      </div>
    );
  }

  const hasRegisteredProfile = !!user;
  const canExtensionBeUninstalled = !!(
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );
  const canExtensionBeDeprecated =
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;
  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

  return (
    <Spinner>
      <div className="mb-6">
        <div className="flex lg:gap-[6.25rem] md:gap-12">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
                <h4 className="ml-2 text-xl font-semibold">{formatMessage(extensionData.name)}</h4>
              </div>
              <div>
                {!isExtensionInstalled && (
                  <Button mode="primarySolid" isFullSize={isMobile} onClick={handleInstallClick}>
                    <p className="text-sm font-medium">{formatMessage({ id: 'extension.installButton' })}</p>
                  </Button>
                )}
                {extensionData.isInitialized && !extensionData.isInitialized && (
                  <Button mode="primarySolid" isFullSize={isMobile} onClick={handleEnableButtonClick}>
                    <p className="text-sm font-medium">{formatMessage({ id: 'extension.enableButton' })}</p>
                  </Button>
                )}
              </div>
            </div>
            <ExtensionDetails
              extensionData={extensionData}
              canBeDeprecated={canExtensionBeDeprecated}
              canBeUninstalled={canExtensionBeUninstalled}
            />
          </div>
        </div>
      </div>
    </Spinner>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
