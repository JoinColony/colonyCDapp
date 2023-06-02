import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/SpecificSidePanel';
import Button from '~shared/Extensions/Button';
import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel';
import SupportingDocuments from '~common/Extensions/SupportingDocuments/SupportingDocuments';
import { useExtensionDetails } from './hooks';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold text-gray-900 mt-6 mb-4">{chunks}</h4>
);

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData, canBeDeprecated, canBeUninstalled }) => {
  const { formatMessage } = useIntl();
  const { sidePanelData, status } = useExtensionDetails(extensionData);

  return (
    <div className="mt-6 w-full flex gap-12 justify-between">
      <div className="w-full">
        {/* @TODO: Add images */}
        <ImageCarousel />
        <div className="mt-[4.25rem] text-md text-gray-600">
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
      <div className="sm:w-[20.375rem]">
        <SpecificSidePanel statuses={status} sidePanelData={sidePanelData} />
        {/* @TODO: Add functionality and modals to deprecate and uninstall extension */}
        {canBeDeprecated && (
          <div className="mt-6">
            <Button mode="primaryOutline" isFullSize>
              {formatMessage({ id: 'extensionDetailsPage.deprecate' })}
            </Button>
          </div>
        )}
        {canBeUninstalled && (
          <div className="mt-6">
            <Button mode="primaryOutline" isFullSize>
              {formatMessage({ id: 'extensionDetailsPage.uninstall' })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
