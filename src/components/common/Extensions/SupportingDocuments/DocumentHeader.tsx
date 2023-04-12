import React from 'react';
import { useIntl } from 'react-intl';

const displayName = 'DocumentHeader';

const DocumentHeader = () => {
  const { formatMessage } = useIntl();
  return (
    <>
      <div className="doc-list-title">{formatMessage({ id: 'supporting.documents.title' })}extension support</div>
      <div className="doc-list-subtitle">{formatMessage({ id: 'supporting.documents.subtitle' })}</div>
      <div className="min-w-[35.75rem] h-[0.0625rem] bg-gray-200 my-4" />
    </>
  );
};

DocumentHeader.displayName = displayName;

export default DocumentHeader;
