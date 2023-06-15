import React, { FC } from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

import SupportingDocuments from '~common/Extensions/SupportingDocuments/SupportingDocuments';
import { AnyExtensionData } from '~types';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.TabContent';

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <h4 className="font-semibold text-gray-900 mt-6 mb-4">{chunks}</h4>
);

const TabContent: FC<AnyExtensionData> = (extensionData: AnyExtensionData) => {
  const { isEnabled, uninstallable, descriptionLong } = extensionData;
  return (
    <li
      className={clsx('list-none', {
        'mt-4': isEnabled && uninstallable,
      })}
    >
      <div className="mt-[2.25rem] md:mt-0 text-md text-gray-600">
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
    </li>
  );
};

TabContent.displayName = displayName;

export default TabContent;
