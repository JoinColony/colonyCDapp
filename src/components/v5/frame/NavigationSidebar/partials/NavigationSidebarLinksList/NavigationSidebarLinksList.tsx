import clsx from 'clsx';
import React, { FC } from 'react';

import NavigationSidebarLink from '../NavigationSidebarLink/NavigationSidebarLink';

import { NavigationSidebarLinksListProps } from './types';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarLinksList';

const NavigationSidebarLinksList: FC<NavigationSidebarLinksListProps> = ({
  items,
  className,
}) =>
  items.length ? (
    <ul className={clsx(className, 'flex flex-col gap-2 w-full')}>
      {items.map(({ key, label, ...item }) => (
        <li key={key}>
          <NavigationSidebarLink {...item}>{label}</NavigationSidebarLink>
        </li>
      ))}
    </ul>
  ) : null;

NavigationSidebarLinksList.displayName = displayName;

export default NavigationSidebarLinksList;
