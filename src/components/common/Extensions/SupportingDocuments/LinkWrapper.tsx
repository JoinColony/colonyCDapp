import { FileText } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useParams } from 'react-router-dom';

import { formatText } from '~utils/intl.ts';
import Link from '~v5/shared/Link/index.ts';

import { links } from './consts.ts';

const displayName = 'common.Extensions.SupportingDocuments.LinkWrapper';

const LinkWrapper: FC = () => {
  const { extensionId } = useParams();

  return (
    <>
      {links[extensionId ?? '']?.map(({ url, message }) => (
        <li key={message.id} className="mb-2 last:mb-0">
          <Link
            key={url}
            to={url}
            className="flex items-center text-md text-gray-600"
          >
            <span
              className="mr-1 flex shrink-0 items-center"
              title={formatText({ id: 'file-text' })}
            >
              <FileText size={14} />
            </span>
            {formatText(message)}
          </Link>
        </li>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
