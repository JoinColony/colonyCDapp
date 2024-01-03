import clsx from 'clsx';
import React, { FC } from 'react';
import { generatePath } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { COLONY_HOME_ROUTE } from '~routes';

import NavigationSidebarLink from '../NavigationSidebarLink/NavigationSidebarLink';

import { NavigationSidebarLinksListProps } from './types';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarLinksList';

const NavigationSidebarLinksList: FC<NavigationSidebarLinksListProps> = ({
  items,
  className,
}) => {
  const { colony } = useColonyContext();
  const colonyName = colony?.name || '';

  const updatedItems = items.map((item) => {
    // Check if the 'to' field needs to be modified
    if (item.to === COLONY_HOME_ROUTE) {
      return { ...item, to: generatePath(item.to, { colonyName }) };
    }
    return item;
  });

  return items.length ? (
    <ul className={clsx(className, 'flex flex-col gap-2 w-full')}>
      {updatedItems.map(({ key, label, ...item }) => (
        <li key={key}>
          <NavigationSidebarLink {...item}>{label}</NavigationSidebarLink>
        </li>
      ))}
    </ul>
  ) : null;
};

NavigationSidebarLinksList.displayName = displayName;

export default NavigationSidebarLinksList;
