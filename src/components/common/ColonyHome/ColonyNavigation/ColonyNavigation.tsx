import React, { ComponentProps, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~hooks';

import NavItem from './NavItem';

import styles from './ColonyNavigation.css';

const displayName = 'common.ColonyHome.ColonyNavigation';

const MSG = defineMessages({
  linkTextActions: {
    id: `${displayName}.linkTextActions`,
    defaultMessage: 'Actions',
  },
  linkTextEvents: {
    id: `${displayName}.linkTextEvents`,
    defaultMessage: 'Events',
  },
  linkTextExtensions: {
    id: `${displayName}.linkTextExtensions`,
    defaultMessage: 'Extensions',
  },
  linkTextUnwrapTokens: {
    id: `${displayName}.linkTextUnwrapTokens`,
    defaultMessage: 'Unwrap Tokens',
  },
  linkTextClaimTokens: {
    id: `${displayName}.linkTextClaimTokens`,
    defaultMessage: 'Claim Tokens',
  },
  comingSoonMessage: {
    id: `${displayName}.comingSoonMessage`,
    defaultMessage: 'Coming Soon',
  },
});

const ColonyNavigation = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};

  /*
   * @TODO actually determine these
   * This can be easily inferred from the subgraph queries
   *
   * But for that we need to store the "current" count either in redux or
   * in local storage... or maybe a local resolver?
   *
   * Problem is I couldn't get @client resolvers to work with subgrap queries :(
   */
  const hasNewActions = false;
  const hasNewExtensions = false;

  const items = useMemo<ComponentProps<typeof NavItem>[]>(() => {
    if (!name) {
      return [];
    }

    const navigationItems = [
      {
        linkTo: `/colony/${name}`,
        showDot: hasNewActions,
        text: MSG.linkTextActions,
      },
      {
        linkTo: `/colony/${name}/extensions`,
        showDot: hasNewExtensions,
        text: MSG.linkTextExtensions,
        dataTest: 'extensionsNavigationButton',
      },
    ];

    return navigationItems;
  }, [name, hasNewActions, hasNewExtensions]);

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
