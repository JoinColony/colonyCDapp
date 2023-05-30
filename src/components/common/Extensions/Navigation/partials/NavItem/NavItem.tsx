import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import styles from './NavItem.module.css';
import NavLink from '~shared/Extensions/NavLink';
import { NavItemProps } from '../../types';

const displayName = 'common.Extensions.Navigation.NavItem';

const NavItem: FC<NavItemProps> = ({ disabled = false, linkTo, label }) => {
  const { formatMessage } = useIntl();

  const labelText = typeof label === 'string' ? label : label && formatMessage(label);

  return (
    <NavLink aria-disabled={disabled} className={clsx(styles.navLink, '[&.active]:bg-gray-50')} to={linkTo}>
      <span>{labelText}</span>
    </NavLink>
  );
};

NavItem.displayName = displayName;

export default NavItem;
