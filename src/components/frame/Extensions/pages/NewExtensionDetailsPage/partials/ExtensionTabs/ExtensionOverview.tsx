import React, { type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel.tsx';
import SupportingDocuments from '~common/Extensions/SupportingDocuments/index.ts';
import { getTextChunks } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';

import ExtensionDetails from '../ExtensionDetails/ExtensionDetails.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionOverview';

interface ExtensionOverviewProps {
  extensionData: AnyExtensionData;
}

const ExtensionOverview: FC<ExtensionOverviewProps> = ({ extensionData }) => {
  const { descriptionLong } = extensionData;
  const { h4, p, b, ul, li } = getTextChunks();

  return (
    <div className="flex flex-col gap-9 md:gap-6">
      <div className="flex flex-col gap-6">
        <ImageCarousel slideUrls={extensionData.imageURLs} />
        <ExtensionDetails extensionData={extensionData} className="md:hidden" />
      </div>
      <div>
        <div className="whitespace-pre-line text-md text-gray-600">
          <FormattedMessage
            {...descriptionLong}
            values={{
              h4,
              p,
              b,
              ul,
              li,
            }}
          />
        </div>
        <div className="mt-6">
          <SupportingDocuments />
        </div>
      </div>
    </div>
  );
};

ExtensionOverview.displayName = displayName;

export default ExtensionOverview;
