import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Icon from '~shared/Icon';
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
      <div className="min-w-[35.75rem] h-[0.0625rem] bg-gray-200 my-4" />
      <Icon appearance={{ size: 'normal' }} name="file-text" title={{ id: 'file-text' }} />
      <LinkWrapper isDoubleLinkVisible={isDoubleLinkVisible} />
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
