import React, { FC, useState } from 'react';
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
import NotificationBanner from '~common/Extensions/NotificationBanner';
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
  // @TODO: Change extension missing permissions functionality
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);

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

  const showEnableBanner = extensionData.extensionId !== 'VotingReputation' && !isInstalledExtensionData(extensionData);

  return (
    <Spinner loadingText="extensionsPage">
      <ThreeColumns
        leftAside={<Navigation />}
        topRow={
          <>
            {showEnableBanner && (
              <div className="mb-6">
                <NotificationBanner
                  title={
                    isPermissionEnabled
                      ? { id: 'extensionReEnable.notification.updated' }
                      : { id: 'extensionReEnable.notification.missing' }
                  }
                  status={isPermissionEnabled ? 'success' : 'warning'}
                  actionText={
                    isPermissionEnabled
                      ? { id: 'extensionReEnable.notification.enabled' }
                      : { id: 'extensionReEnable.notification.enable' }
                  }
                  actionType="call-to-action"
                  onClick={() => setIsPermissionEnabled(true)}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name={extensionData.icon} appearance={{ size: 'large' }} />
                <h4 className="ml-2 text-xl font-semibold text-gray-900">{formatMessage(extensionData.name)}</h4>
              </div>
              <div className="sm:ml-4">
                <ActionButtons extensionData={extensionData} />
              </div>
            </div>
          </>
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
