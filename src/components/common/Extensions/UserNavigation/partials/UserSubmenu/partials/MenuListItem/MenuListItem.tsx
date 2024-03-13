import React, { type PropsWithChildren } from 'react';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.blocks.MenuListItem';

type MenuListItemProps = PropsWithChildren<unknown>;

const MenuListItem = ({ children }: MenuListItemProps) => {
  return (
    <li className="-ml-4 mb-2 w-[calc(100%+2rem)] rounded last:mb-0 hover:bg-gray-50 sm:mb-0">
      {children}
    </li>
  );
};

MenuListItem.displayName = displayName;
export default MenuListItem;
