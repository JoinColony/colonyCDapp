import React from 'react';
import { Extension } from '@colony/colony-js';

import { Colony, Expenditure } from '~types';
import { notNull } from '~utils/arrays';
import { useEnabledExtensions, useExtensionData } from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';

import ExpenditureStagesItem from './ExpenditureStagesItem';

import styles from './ExpenditureStages.module.css';

interface ExpenditureStagesProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureStages = ({ expenditure, colony }: ExpenditureStagesProps) => {
  const stages = expenditure.metadata?.stages?.filter(notNull) ?? [];

  const { extensionData } = useExtensionData(Extension.StagedExpenditure);
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const stagedExpenditureAddress =
    extensionData && isInstalledExtensionData(extensionData)
      ? extensionData.address
      : undefined;

  return (
    <div>
      <div>Stages</div>

      <ul className={styles.stages}>
        {expenditure.slots.map((slot) => (
          <ExpenditureStagesItem
            key={slot.id}
            colony={colony}
            expenditure={expenditure}
            expenditureStages={stages}
            expenditureSlot={slot}
            stagedExpenditureAddress={stagedExpenditureAddress}
            isVotingReputationEnabled={isVotingReputationEnabled}
          />
        ))}
      </ul>
      {!isVotingReputationEnabled && (
        <span>
          Install the governance extension to enable the expenditure release
          motion
        </span>
      )}
    </div>
  );
};

export default ExpenditureStages;
