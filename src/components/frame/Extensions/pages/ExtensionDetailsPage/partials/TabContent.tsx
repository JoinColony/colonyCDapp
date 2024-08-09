import React, { type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import ImageCarousel from '~common/Extensions/ImageCarousel/ImageCarousel.tsx';
import SupportingDocuments from '~common/Extensions/SupportingDocuments/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

import ExtensionDetails from './ExtensionDetails/ExtensionDetails.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.TabContent';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="mb-4 mt-6 font-semibold text-gray-900">{chunks}</h4>
);

const ParagraphChunks = (chunks: React.ReactNode[]) => (
  <p className="mb-4">{chunks}</p>
);
const BoldChunks = (chunks: React.ReactNode[]) => (
  <b className="font-medium text-gray-900">{chunks}</b>
);
const ListChunks = (chunks: React.ReactNode[]) => (
  <ul className="my-4 ml-4 list-disc">{chunks}</ul>
);
const ListItemChunks = (chunks: React.ReactNode[]) => <li>{chunks}</li>;

interface TabContentProps {
  extensionData: AnyExtensionData;
}
const TabContent: FC<TabContentProps> = ({ extensionData }) => {
  const { descriptionLong } = extensionData;

  return (
    <div>
      <div className="mb-6">
        <ImageCarousel slideUrls={extensionData.imageURLs} />
      </div>
      <div className="mb-9 md:hidden">
        <ExtensionDetails extensionData={extensionData} />
      </div>
      <div className="text-md text-gray-600">
        <FormattedMessage
          {...descriptionLong}
          values={{
            h4: HeadingChunks,
            p: ParagraphChunks,
            b: BoldChunks,
            ul: ListChunks,
            li: ListItemChunks,
          }}
        />
      </div>
      <div className="mt-6">
        <SupportingDocuments />
      </div>
    </div>
  );
};

TabContent.displayName = displayName;

export default TabContent;
