import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useColonyContext, useExtensionData } from '~hooks';
import Icon from '~shared/Icon';
import ExtensionDetails from './partials/ExtensionDetails';
import Spinner from '~shared/Extensions/Spinner';
import ThreeColumns from '~frame/Extensions/ThreeColumns';
import Navigation from '~common/Extensions/Navigation';
import SupportingDocuments from '~common/Extensions/SupportingDocuments';
import ImageCarousel from '~common/Extensions/ImageCarousel';
import ActionButtons from '../partials/ActionButtons';
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

  if (!colony || !extensionData) {
    return null;
  }

  if (!extensionData) {
    return <p>{formatMessage({ id: 'extensionDetailsPage.unsupportedExtension' })}</p>;
  }

  if (!isInstalledExtensionData(extensionData)) {
    return null;
  }

  return (
    <Spinner loadingText="extensionsPage">
      <ThreeColumns
        leftAside={<Navigation />}
        topRow={
          <div className="flex justify-between flex-col flex-wrap sm:items-center sm:flex-row sm:gap-6">
            <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
              <div className="flex items-center shrink-0">
                <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
                <h4 className="ml-2 text-xl font-semibold text-gray-900">{formatMessage(extensionData.name)}</h4>
              </div>
              {/* @TODO get these values from API (badge and active installs number) */}
              <div className="flex items-center justify-between gap-4 mt-4 sm:mt-0 sm:grow">
                <span>badge</span>
                <p className="text-gray-400 text-sm">17,876 Active Installs</p>
              </div>
            </div>
            <ActionButtons extensionData={extensionData} />
          </div>
        }
        withSlider={<ImageCarousel />}
        rightAside={<ExtensionDetails extensionData={extensionData} />}
      >
        <div>
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
        </div>
      </ThreeColumns>
    </Spinner>
  );
};

ExtensionDetailsPage.displayName = displayName;

export default ExtensionDetailsPage;
