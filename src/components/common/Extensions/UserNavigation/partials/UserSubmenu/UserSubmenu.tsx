import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { UserSubmenuProps } from './types';
import { userSubmenuItems } from './consts';
import Icon from '~shared/Icon/Icon';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

const UserSubmenu: FC<UserSubmenuProps> = ({ submenuId }) => (
  <ul className="mt-2">
    {userSubmenuItems[submenuId].map((item) => (
      <li key={item.id} className="mb-4 last:mb-0">
        <Link to={item.url} className="flex items-center">
          <Icon name={item.icon} appearance={{ size: 'small' }} />{' '}
          <p className="ml-2 text-lg font-semibold md:font-normal md:text-md">{item.label}</p>
        </Link>
      </li>
    ))}
  </ul>
);

UserSubmenu.displayName = displayName;

export default UserSubmenu;
