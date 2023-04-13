import React from 'react';
import { useIntl } from 'react-intl';
import Link from '~shared/Link';
import { LAZY_CONSENSUS, PAYMENTS, MOTIONS_AND_DISPUTES } from '~constants';

interface LinkWrapperProps {
  isDoubleLinkVisible: boolean;
}

const displayName = 'LinkWrapper';

const singleLink = [
  {
    url: LAZY_CONSENSUS,
    text: 'supporting.documents.link1',
  },
];

const doubleLink = [
  {
    url: PAYMENTS,
    text: 'supporting.documents.link2',
  },
  {
    url: MOTIONS_AND_DISPUTES,
    text: 'supporting.documents.link3',
  },
];

const LinkWrapper = ({ isDoubleLinkVisible }: LinkWrapperProps) => {
  const { formatMessage } = useIntl();
  const links = isDoubleLinkVisible ? doubleLink : singleLink;

  return (
    <>
      {links.map((item) => (
        <div className="pb-2">
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
