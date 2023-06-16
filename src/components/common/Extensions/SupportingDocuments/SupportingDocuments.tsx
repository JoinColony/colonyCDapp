import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import LinkWrapper from './LinkWrapper';
import { SupportingDocumentsProps } from './types';

const displayName = 'common.Extensions.SupportingDocuments';

const SupportingDocuments: FC<SupportingDocumentsProps> = ({
  isDoubleLinkVisible = false,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <p className="uppercase text-xs font-medium text-blue-400">
        {formatMessage({ id: 'supporting.documents.title' })}
      </p>
      <p className="font-semibold text-md text-gray-900">
        {formatMessage({ id: 'supporting.documents.subtitle' })}
      </p>
      <span className="block border-b border-gray-200 my-4" />
      <div className="mb-2 last:mb-0">
        <LinkWrapper isDoubleLinkVisible={isDoubleLinkVisible} />
      </div>
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
