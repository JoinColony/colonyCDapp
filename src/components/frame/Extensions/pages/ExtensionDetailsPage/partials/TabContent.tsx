import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import SupportingDocuments from '~common/Extensions/SupportingDocuments';
import { AnyExtensionData } from '~types/extensions';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.TabContent';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="text-gray-900 font-semibold mt-6 mb-4">{chunks}</h4>
);

const ParagraphChunks = (chunks: React.ReactNode[]) => (
  <p className="mb-4">{chunks}</p>
);
const BoldChunks = (chunks: React.ReactNode[]) => (
  <b className="text-gray-900 font-medium">{chunks}</b>
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
