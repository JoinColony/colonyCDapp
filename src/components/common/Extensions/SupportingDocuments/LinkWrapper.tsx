import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import Link from '~v5/shared/Link';
import { doubleLink, singleLink } from './consts';

interface LinkWrapperProps {
  isDoubleLinkVisible: boolean;
}

const displayName = 'common.Extensions.SupportingDocuments.LinkWrapper';

const LinkWrapper: FC<LinkWrapperProps> = ({ isDoubleLinkVisible }) => {
  const { formatMessage } = useIntl();
  const links = isDoubleLinkVisible ? doubleLink : singleLink;

  return (
    <>
      {links.map(({ url, text }) => (
        <li key={text} className="mb-2 last:mb-0">
          <Link
            key={url}
            to={url}
            className="flex items-center text-md text-gray-600"
          >
            <span className="flex items-center shrink-0 mr-1">
              <Icon
                appearance={{ size: 'tiny' }}
                name="file-text"
                title={{ id: 'file-text' }}
              />
            </span>
            {formatMessage({ id: text })}
          </Link>
        </li>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
