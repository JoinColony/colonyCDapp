import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.blocks.MenuList';

type MenuListProps = PropsWithChildren<{ className?: string }>;

const MenuList = ({ children, className }: MenuListProps) => {
  return <ul className={clsx('-mb-2', className)}>{children}</ul>;
};

MenuList.displayName = displayName;
export default MenuList;
