import React, { type FC } from 'react';
import { FormattedMessage } from 'react-intl';

import ImageCarousel from '~common/Extensions/ImageCarousel/index.ts';
import SupportingDocuments from '~common/Extensions/SupportingDocuments/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

import ExtensionDetails from '../ExtensionDetailsWidget/ExtensionDetailsWidget.tsx';

const displayName =
  'frame.Extensions.pages.ExtensionPage.partials.ExtensionOverview';

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
const ExtensionOverview: FC<TabContentProps> = ({ extensionData }) => {
  const { descriptionLong } = extensionData;

  return (
    <div>
      <div className="pb-8">
        <ImageCarousel slideUrls={extensionData.imageURLs} />
      </div>
      <div className="pb-8 md:order-4 md:hidden">
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

ExtensionOverview.displayName = displayName;

export default ExtensionOverview;
