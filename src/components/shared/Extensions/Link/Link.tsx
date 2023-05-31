import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Link as LinkComponent } from 'react-router-dom';

import { isUrlExternal } from '~utils/isUrlExternal';
import { LinkProps } from './types';

const Link: FC<LinkProps> = ({ children, text, textValues, to, className, onClick, ...linkProps }) => {
  const { formatMessage } = useIntl();
  const IS_URL_EXTERNAL = isUrlExternal(to);

  const linkText = typeof text === 'string' ? text : text && formatMessage(text, textValues);
  return IS_URL_EXTERNAL ? (
    <a
      href={to}
      rel="nofollow noopener noreferrer"
      target={IS_URL_EXTERNAL ? '_blank' : undefined}
      className={`${className} transition-all duration-normal hover:text-blue-400`}
      onClick={onClick}
    >
      {linkText || children}
    </a>
  ) : (
    <LinkComponent {...linkProps} to={to} className={`${className} transition-all duration-normal hover:text-blue-400`}>
      {linkText || children}
    </LinkComponent>
  );
};

export default Link;
