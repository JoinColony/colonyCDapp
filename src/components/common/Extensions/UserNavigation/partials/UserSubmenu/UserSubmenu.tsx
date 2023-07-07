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
          <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
            <Icon
              name={icon}
              appearance={{ size: 'small' }}
              className="navigation-link"
            />
            <p className="ml-2 ">{label}</p>{' '}
          </span>
        </NavLink>
      </li>
    ))}
  </ul>
);

UserSubmenu.displayName = displayName;

export default UserSubmenu;
