import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import { NavLink as NavLinkComponent } from 'react-router-dom';
import { NavLinkProps } from './types';

const displayName = 'Extensions.NavLink';

const NavLink: FC<PropsWithChildren<NavLinkProps>> = ({
  children,
  text,
  textValues,
  title,
  titleValues,
  to,
  ...props
}) => {
  const { formatMessage } = useIntl();

  const linkText = typeof text === 'string' ? text : text && formatMessage(text, textValues);
  const titleText = typeof title === 'string' ? title : title && formatMessage(title, titleValues);

  return (
    <NavLinkComponent to={to} title={titleText} {...props}>
      {linkText || children}
    </NavLinkComponent>
  );
};

NavLink.displayName = displayName;

export default NavLink;
