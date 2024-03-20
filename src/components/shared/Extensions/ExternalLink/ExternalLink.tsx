import React from 'react';
import { useIntl } from 'react-intl';

import { type ExternalLinkProps } from './types.ts';

const displayName = 'Extensions.ExternalLink';

const ExternalLink = ({
  children,
  href,
  text,
  textValues,
  className,
  title,
  download,
}: ExternalLinkProps) => {
  const { formatMessage } = useIntl();
  const typeOfText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);
  const linkText = children || typeOfText || href;

  return (
    <a
      className={`${className} transition-all duration-normal hover:text-blue-400`}
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
