import React, { FC } from 'react';
import { UserSubmenuProps } from './types';
import { userSubmenuItems } from './consts';
import Icon from '~shared/Icon';
import NavLink from '~shared/NavLink';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

const UserSubmenu: FC<UserSubmenuProps> = ({ submenuId }) => (
  <ul className="mt-2">
    {userSubmenuItems[submenuId].map((item) => (
      <li key={item.id} className="mb-4 last:mb-0">
        <NavLink to={item.url} className="flex items-center">
          <Icon name={item.icon} appearance={{ size: 'small' }} />{' '}
          <p className="ml-2 text-lg font-semibold md:font-normal md:text-md">{item.label}</p>
        </NavLink>
      </li>
    ))}
  </ul>
);

UserSubmenu.displayName = displayName;

export default UserSubmenu;
