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
  hasHover,
}) => {
  const linkText = children || href;
  return (
    <a
      className={clsx(className, {
        'transition-all duration-normal hover:text-blue-400': hasHover,
      })}
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
