import React, { FC } from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

import SupportingDocuments from '~common/Extensions/SupportingDocuments';
import { AnyExtensionData } from '~types';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.TabContent';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold mt-6 mb-4">{chunks}</h4>
);

const TabContent: FC<AnyExtensionData> = (extensionData: AnyExtensionData) => {
  const { isEnabled, uninstallable, descriptionLong } = extensionData;

  return (
    <div
      className={clsx({
        'mt-4': isEnabled && uninstallable,
      })}
    >
      <div className="text-md text-gray-600">
        <FormattedMessage
          {...descriptionLong}
          values={{
            h4: HeadingChunks,
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
