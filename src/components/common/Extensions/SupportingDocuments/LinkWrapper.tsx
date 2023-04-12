import React from 'react';
import Link from '~shared/Link';

const displayName = 'LinkWrapper';

interface ILinkWrapperProps {
  url: string;
  text: string;
}

const LinkWrapper = ({ url, text }: ILinkWrapperProps) => (
  <Link to={url} className="font-normal text-sm text-gray-600">
    {text}
  </Link>
);

LinkWrapper.displayName = displayName;

export default LinkWrapper;
