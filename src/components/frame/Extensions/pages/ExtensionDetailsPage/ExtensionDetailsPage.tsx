import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useColonyContext, useExtensionData, useMobile } from '~hooks';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';

import ExtensionDetails from './partials/ExtensionDetails';
import { useExtensionDetailsPage } from './hooks';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns';
import Navigation from '~common/Extensions/Navigation';
import SupportingDocuments from '~common/Extensions/SupportingDocuments';
import ImageCarousel from '~common/Extensions/ImageCarousel';
import { isInstalledExtensionData } from '~utils/extensions';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold text-gray-900 mt-6 mb-4">{chunks}</h4>
);

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage';

const ExtensionDetailsPage: FC = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId ?? '');
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { handleEnableButtonClick, handleInstallClick } = useExtensionDetailsPage();

  const isExtensionInstalled = extensionData && isInstalledExtensionData(extensionData);

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

  return (
    <Spinner loadingText="extensionsPage">
      <ThreeColumns
        leftAside={<Navigation />}
        topRow={
          <div className="flex items-center">
            <div className="flex items-center">
              <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
              <h4 className="ml-2 text-xl font-semibold text-gray-900">{formatMessage(extensionData.name)}</h4>
            </div>
            <div className="sm:ml-4">
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
        }
        withSlider={<ImageCarousel />}
        rightAside={<ExtensionDetails extensionData={extensionData} />}
      >
        <div className="mt:mt-[4.25rem] text-md text-gray-600">
          <FormattedMessage
            {...extensionData.descriptionLong}
            values={{
              h4: HeadingChunks,
            }}
          />
        </div>
        <div className="mt-6">
          <SupportingDocuments />
        </div>
      </ThreeColumns>
    </Spinner>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
