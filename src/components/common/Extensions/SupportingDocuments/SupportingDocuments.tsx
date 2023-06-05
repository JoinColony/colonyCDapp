import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import LinkWrapper from './LinkWrapper';
import { SupportingDocumentsProps } from './types';

const displayName = 'common.Extensions.SupportingDocuments';

const SupportingDocuments: FC<SupportingDocumentsProps> = ({ isDoubleLinkVisible = false }) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="uppercase text-xs font-medium text-blue-400">
        {formatMessage({ id: 'supporting.documents.title' })}
      </div>
      <div className="font-semibold text-md text-gray-900">
        {formatMessage({ id: 'supporting.documents.subtitle' })}
      </div>
      <span className="block border-b border-gray-200 my-4" />
      <LinkWrapper isDoubleLinkVisible={isDoubleLinkVisible} />
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
