import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import NavLink from '~v5/shared/NavLink/index.ts';

import { type NavItemProps } from '../../types.ts';

import styles from './NavItem.module.css';

const displayName = 'v5.common.Navigation.partials.NavItem';

const NavItem: FC<NavItemProps> = ({ disabled = false, linkTo, label }) => {
  const { formatMessage } = useIntl();

  const labelText =
    typeof label === 'string' ? label : label && formatMessage(label);

  return (
    <NavLink
      aria-disabled={disabled}
      className={clsx(
        styles.navLink,
        'text-1 [&.active]:bg-gray-50 hover:text-current',
      )}
      to={linkTo}
    >
      <span>{labelText}</span>
    </NavLink>
  );
};

NavItem.displayName = displayName;

export default NavItem;
