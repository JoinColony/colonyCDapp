import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import styles from './NavItem.module.css';
import NavLink from '~v5/shared/NavLink';
import { NavItemProps } from '../../types';

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
