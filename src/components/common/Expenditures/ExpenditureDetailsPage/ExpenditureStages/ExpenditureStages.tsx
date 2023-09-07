import React from 'react';
import { Extension } from '@colony/colony-js';

import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { Colony, Expenditure } from '~types';
import { notNull } from '~utils/arrays';
import { ExpenditureStatus } from '~gql';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useExtensionData } from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';

import styles from './ExpenditureStages.module.css';

interface ExpenditureStagesProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureStages = ({ expenditure, colony }: ExpenditureStagesProps) => {
  const stages = expenditure.metadata?.stages?.filter(notNull) ?? [];

  const { extensionData } = useExtensionData(Extension.StagedExpenditure);

  const stagedExpenditureAddress =
    extensionData && isInstalledExtensionData(extensionData)
      ? extensionData.address
      : undefined;

  return (
    <div>
      <div>Stages</div>

      <ul className={styles.stages}>
        {stages.map((stage) => (
          <li key={stage.slotId} className={styles.stage}>
            <div>
              <div>Milestone</div>
              <div>{stage.name}</div>
            </div>

            <div>
              <div>Token address</div>
              <div>
                <MaskedAddress
                  key={stage.tokenAddress}
                  address={stage.tokenAddress}
                />
              </div>
            </div>

            <div>
              <div>Amount</div>
              <div>
                <Numeral
                  value={stage.amount}
                  decimals={colony.nativeToken.decimals}
                  suffix={colony.nativeToken.symbol}
                />
              </div>
            </div>

            {expenditure.status === ExpenditureStatus.Finalized && (
              <ActionButton
                actionType={ActionTypes.RELEASE_EXPENDITURE_STAGE}
                values={{
                  colonyAddress: colony.colonyAddress,
                  expenditure,
                  slotId: stage.slotId,
                  tokenAddress: stage.tokenAddress,
                  stagedExpenditureAddress,
                }}
              >
                Release
              </ActionButton>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenditureStages;
