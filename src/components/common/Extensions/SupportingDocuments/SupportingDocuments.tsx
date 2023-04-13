import React from 'react';
import { useIntl } from 'react-intl';
// import FileText from '~images/icons/FileText.svg';
import LinkWrapper from './LinkWrapper';
import { SupportingDocumentsProps } from './types';

const displayName = 'common.Extensions.SupportingDocuments';

const SupportingDocuments = ({ isDoubleLinkVisible = false }: SupportingDocumentsProps) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="uppercase text-xs font-medium text-blue-400">
        {formatMessage({ id: 'supporting.documents.title' })}
      </div>
      <div className="font-semibold text-base text-gray-900">
        {formatMessage({ id: 'supporting.documents.subtitle' })}
      </div>
      <div className="min-w-[35.75rem] h-[0.0625rem] bg-gray-200 my-4" />
      {/* <FileText /> */}
      <LinkWrapper isDoubleLinkVisible={isDoubleLinkVisible} />
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
