import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import LinkWrapper from './LinkWrapper';
import { SupportingDocumentsProps } from './types';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName = 'common.Extensions.SupportingDocuments';

const SupportingDocuments: FC<SupportingDocumentsProps> = ({
  isDoubleLinkVisible = false,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <TitleLabel
        className="!text-blue-400"
        text={formatMessage({ id: 'supporting.documents.title' })}
      />
      <p className="text-2">
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
