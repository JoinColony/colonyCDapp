import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Link from '~shared/Link';
import { doubleLink, singleLink } from './consts';

interface LinkWrapperProps {
  isDoubleLinkVisible: boolean;
}

const displayName = 'common.Extensions/SupportingDocuments/LinkWrapper';

const LinkWrapper: FC<LinkWrapperProps> = ({ isDoubleLinkVisible }) => {
  const { formatMessage } = useIntl();
  const links = isDoubleLinkVisible ? doubleLink : singleLink;

  return (
    <>
      {links.map((item) => (
        <div className="pb-2" key={item.url}>
          <Link key={item.url} to={item.url} className="font-normal text-sm text-gray-600 hover:text-blue-400">
            {formatMessage({ id: item.text })}
          </Link>
        </div>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
