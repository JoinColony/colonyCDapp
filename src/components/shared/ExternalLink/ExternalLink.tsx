import clsx from 'clsx';
import React, { type FC } from 'react';

import { type ExternalLinkProps } from './types.ts';

const displayName = 'ExternalLink';

const ExternalLink: FC<ExternalLinkProps> = ({
  children,
  href,
  className,
  title,
  download,
}) => {
  const linkText = children || href;
  return (
    <a
      className={clsx(
        className,
        'text-gray-900 transition-colors duration-normal hover:text-blue-400',
      )}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      title={title}
      {...(download !== undefined ? { download } : {})}
    >
      {linkText}
    </a>
  );
};

ExternalLink.displayName = displayName;

export default ExternalLink;
