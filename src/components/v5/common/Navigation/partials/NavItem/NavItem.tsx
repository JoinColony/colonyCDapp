import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { type NavItemProps } from '~v5/common/Navigation/types.ts';
import NavLink from '~v5/shared/NavLink/index.ts';

const displayName = 'v5.common.Navigation.partials.NavItem';

const NavItem: FC<NavItemProps> = ({ disabled = false, linkTo, label }) => {
  const { formatMessage } = useIntl();

  const labelText =
    typeof label === 'string' ? label : label && formatMessage(label);

  return (
    <NavLink
      aria-disabled={disabled}
      className="mb-2.5 block min-h-[2.25rem] rounded px-3 py-2 text-gray-900 transition-all duration-normal text-1 last:mb-0 hover:bg-gray-50 hover:text-current disabled:pointer-events-none disabled:text-gray-400 [&.active]:bg-gray-50"
      to={linkTo}
    >
      <span>{labelText}</span>
    </NavLink>
  );
};

NavItem.displayName = displayName;

export default NavItem;
