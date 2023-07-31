import React from 'react';

import { useColonyContext } from '~hooks';

import NavItem from './NavItem';
import useGetNavigationItems, { displayName } from './colonyNavigationConfig';

import styles from './ColonyNavigation.css';

const ColonyNavigation = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};

  const items = useGetNavigationItems(name);
  return (
    <nav role="navigation" className={styles.main}>
      {items.map((itemProps) => (
        <NavItem key={itemProps.linkTo} {...itemProps} />
      ))}
    </nav>
  );
};

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
