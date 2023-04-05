import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Icon from '~shared/Icon';
import Link from '~shared/Link';
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
        <div className="pb-2 flex items-center group" key={item.text}>
          <Icon
            appearance={{ size: 'tiny' }}
            name="file-text"
            title={{ id: 'file-text' }}
            className="group-hover:[&>svg]:fill-blue-400 w-3 h-3"
          />
          <Link key={item.url} to={item.url} className="font-normal text-sm text-gray-600 hover:text-blue-400 ml-2">
            {formatMessage({ id: item.text })}
          </Link>
        </div>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
