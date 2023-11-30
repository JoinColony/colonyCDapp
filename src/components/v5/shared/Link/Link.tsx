import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Link as LinkComponent } from 'react-router-dom';
import clsx from 'clsx';

import { isUrlExternal } from '~utils/isUrlExternal';
import { LinkProps } from './types';

const displayName = 'v5.Link';

const Link: FC<LinkProps> = ({
  children,
  text,
  textValues,
  to,
  className,
  onClick,
  ...linkProps
}) => {
  const { formatMessage } = useIntl();
  const IS_URL_EXTERNAL = isUrlExternal(to);
  const isUrlIncludeHttp = typeof to === 'string' && to.includes('http');

  const linkText =
    typeof text === 'string' ? text : text && formatMessage(text, textValues);
  return (IS_URL_EXTERNAL && typeof to === 'string') || isUrlIncludeHttp ? (
    <a
      href={to}
      rel="nofollow noopener noreferrer"
      target="_blank"
      className={clsx(
        className,
        'transition-all duration-normal md:hover:text-blue-400',
      )}
      onClick={onClick}
    >
      {linkText || children}
    </a>
  ) : (
    <LinkComponent
      {...linkProps}
      to={to}
      className={clsx(
        className,
        'transition-all duration-normal md:hover:text-blue-400',
      )}
    >
      {linkText || children}
    </LinkComponent>
  );
};

Link.displayName = displayName;

export default Link;
