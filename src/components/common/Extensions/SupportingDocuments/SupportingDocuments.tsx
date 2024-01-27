import React, { FC } from 'react';

import { formatText } from '~utils/intl.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import LinkWrapper from './LinkWrapper.tsx';

const displayName = 'common.Extensions.SupportingDocuments';

const SupportingDocuments: FC = () => {
  return (
    <div>
      <TitleLabel
        className="mb-1"
        text={formatText({ id: 'supporting.documents.title' })}
      />
      <p className="text-2">
        {formatText({ id: 'supporting.documents.subtitle' })}
      </p>
      <span className="block border-b border-gray-200 mt-2 mb-4" />
      <ul className="mb-2 last:mb-0">
        <LinkWrapper />
      </ul>
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
