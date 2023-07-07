import React, { FC } from 'react';

import { UserSubmenuProps } from './types';
import { userSubmenuItems } from './consts';
import Icon from '~shared/Icon';
import NavLink from '~v5/shared/NavLink';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

const UserSubmenu: FC<UserSubmenuProps> = ({ submenuId }) => (
  <ul className="mt-2">
    {userSubmenuItems[submenuId].map(({ id, url, icon, label }) => (
      <li key={id} className="mb-4 last:mb-0">
        <NavLink to={url} className="flex items-center">
          <Icon name={icon} appearance={{ size: 'extraSmall' }} />
          <p className="ml-2 heading-5 sm:font-normal sm:text-md">{label}</p>
        </NavLink>
      </li>
    ))}
  </ul>
);

UserSubmenu.displayName = displayName;

export default UserSubmenu;
