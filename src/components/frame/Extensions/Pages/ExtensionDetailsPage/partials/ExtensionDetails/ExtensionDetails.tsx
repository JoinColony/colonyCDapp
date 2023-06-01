import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/SpecificSidePanel';
import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel';
import SupportingDocuments from '~common/Extensions/SupportingDocuments/SupportingDocuments';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold text-gray-900 mt-6 mb-4">{chunks}</h4>
);

const displayName = 'common.Extensions.Pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => (
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
      <SpecificSidePanel />
    </div>
  </div>
);

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
