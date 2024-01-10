import React, { PropsWithChildren } from 'react';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.blocks.MenuListItem';

type MenuListItemProps = PropsWithChildren<unknown>;

const MenuListItem = ({ children }: MenuListItemProps) => {
  return (
    <li className="mb-2 last:mb-0 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
      {children}
    </li>
  );
};

MenuListItem.displayName = displayName;
export default MenuListItem;
