import React, { PropsWithChildren } from 'react';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.blocks.MenuList';

type MenuListProps = PropsWithChildren<unknown>;

const MenuList = ({ children }: MenuListProps) => {
  return <ul className="-mb-2">{children}</ul>;
};

MenuList.displayName = displayName;
export default MenuList;
