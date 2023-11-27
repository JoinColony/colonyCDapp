import React from 'react';
import { useLocation } from 'react-router-dom';

import NewActionButton from '~common/NewActionButton';
import NewDecisionButton from '~common/ColonyDecisions/NewDecisionButton';
import { useColonyHomeContext } from '~context';
import { COLONY_DECISIONS_ROUTE } from '~routes';

import ColonyDomainSelector from '../ColonyDomainSelector';

import styles from './ColonyHomeLayout.css';

const isDecisionsRoute = (pathname: string) => {
  return pathname.split('/').at(-1) === COLONY_DECISIONS_ROUTE;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout.ActionsPanel';

const ActionsPanel = () => {
  const { pathname } = useLocation();
  const {
    domainIdFilter: filteredDomainId,
    setDomainIdFilter: onDomainChange,
  } = useColonyHomeContext();
  const NewItemButton = isDecisionsRoute(pathname)
    ? NewDecisionButton
    : NewActionButton;

  return (
    <div className={styles.contentActionsPanel}>
      <div className={styles.domainsDropdownContainer}>
        <ColonyDomainSelector
          filteredDomainId={filteredDomainId}
          onDomainChange={onDomainChange}
        />
      </div>
      <NewItemButton filteredDomainId={filteredDomainId} />
    </div>
  );
};

ActionsPanel.displayName = displayName;

export default ActionsPanel;
