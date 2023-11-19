import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import clsx from 'clsx';

import { UserSubmenuProps } from './types';
import { userSubmenuItems } from './consts';
import Icon from '~shared/Icon';
import NavLink from '~v5/shared/NavLink';
import { useMobile } from '~hooks';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

const UserSubmenu: FC<UserSubmenuProps> = ({ submenuId }) => {
  const isMobile = useMobile();
  const iconSize = isMobile ? 'small' : 'tiny';

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  ) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <ul className="-mb-2">
      {userSubmenuItems[submenuId].map((item) => (
        <li
          key={item.id}
          className={clsx('mb-2 last:mb-0 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]', item.className)}
        >
          {item.external ? (
            <a
              href={item.url}
              className={clsx(
                'flex items-center navigation-link',
                item.className,
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={item.onClick}
            >
              <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                <Icon name={item.icon} appearance={{ size: iconSize }} />
                <p className="ml-2 ">
                  <FormattedMessage {...item.label} />
                </p>
              </span>
            </a>
          ) : (
            <NavLink
              to={item.url}
              className={clsx(
                'flex items-center navigation-link',
                item.className,
              )}
              onClick={(event) => handleMenuItemClick(event, item.onClick)}
            >
              <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                <Icon name={item.icon} appearance={{ size: iconSize }} />
                <p className="ml-2 ">
                  <FormattedMessage {...item.label} />
                </p>
              </span>
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
