import React from 'react';
import { Params, useParams } from 'react-router-dom';

import NewActionButton from '~common/NewActionButton';
import NewDecisionButton from '~common/NewDecisionButton';

import ColonyDomainSelector from '../ColonyDomainSelector';
import { ColonyHomeLayoutProps } from './ColonyHomeLayout';

import styles from './ColonyHomeLayout.css';

const isDecisionsRoute = (params: Params) => {
  return params['*'] === 'decisions';
};

interface ActionsPanelProps {
  onDomainChange: ColonyHomeLayoutProps['onDomainChange'];
  filteredDomainId: number;
}

const displayName = 'common.ColonyHome.ColonyHomeLayout.ActionsPanel';

const ActionsPanel = ({
  onDomainChange,
  filteredDomainId,
}: ActionsPanelProps) => {
  const params = useParams();

  const NewItemButton = isDecisionsRoute(params)
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
      <NewItemButton ethDomainId={filteredDomainId} />
    </div>
  );
};

ActionsPanel.displayName = displayName;

export default ActionsPanel;
