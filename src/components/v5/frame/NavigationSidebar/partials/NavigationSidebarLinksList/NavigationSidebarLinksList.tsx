import clsx from 'clsx';
import React, { type FC } from 'react';
import { generatePath } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { COLONY_HOME_ROUTE } from '~routes/index.ts';

import NavigationSidebarLink from '../NavigationSidebarLink/NavigationSidebarLink.tsx';

import { type NavigationSidebarLinksListProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarLinksList';

const NavigationSidebarLinksList: FC<NavigationSidebarLinksListProps> = ({
  items,
  className,
}) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();

  const updatedItems = items.map((item) => {
    // Check if the 'to' field needs to be modified
    if (item.to === COLONY_HOME_ROUTE) {
      return { ...item, to: generatePath(item.to, { colonyName }) };
    }
    return item;
  });

  return items.length ? (
    <ul className={clsx(className, 'flex w-full flex-col gap-2')}>
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
