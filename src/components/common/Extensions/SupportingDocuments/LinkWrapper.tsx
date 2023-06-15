import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import Link from '~shared/Extensions/Link';
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
      {links.map((item) => (
        <Link
          key={item.url}
          to={item.url}
          className="flex items-center text-sm text-gray-600"
        >
          <Icon
            appearance={{ size: 'tiny' }}
            name="file-text"
            title={{ id: 'file-text' }}
            className="w-3 h-3 mr-2"
          />
          {formatMessage({ id: item.text })}
        </Link>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
