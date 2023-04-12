import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { Link as LinkComponent, LinkProps as LinkComponentProps } from 'react-router-dom';

import { SimpleMessageValues } from '~types';
import { isUrlExternal } from '~utils/isUrlExternal';

interface Props extends LinkComponentProps {
  to: string;
  /** A string or a `messageDescriptor` that make up the link's text */
  text?: MessageDescriptor | string;

  /** Values for text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Link = ({ children, text, textValues, to, className, onClick, ...linkProps }: Props) => {
  const { formatMessage } = useIntl();
  const IS_URL_EXTERNAL = isUrlExternal(to);

  const linkText = typeof text === 'string' ? text : text && formatMessage(text, textValues);
  return IS_URL_EXTERNAL ? (
    <a
      href={to}
      rel="nofollow noopener noreferrer"
      target={IS_URL_EXTERNAL ? '_blank' : undefined}
      className={className}
      onClick={onClick}
    >
      {linkText || children}
    </a>
  ) : (
    <LinkComponent {...linkProps} to={to}>
      {linkText || children}
    </LinkComponent>
  );
};

export default Link;
