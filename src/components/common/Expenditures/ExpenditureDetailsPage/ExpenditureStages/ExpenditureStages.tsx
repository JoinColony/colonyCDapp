import React from 'react';

import MaskedAddress from '~shared/MaskedAddress';
import Numeral from '~shared/Numeral';
import { Colony, Expenditure } from '~types';
import { notNull } from '~utils/arrays';

import styles from './ExpenditureStages.module.css';

interface ExpenditureStagesProps {
  expenditure: Expenditure;
  colony: Colony;
}

const ExpenditureStages = ({ expenditure, colony }: ExpenditureStagesProps) => {
  const stages = expenditure.metadata?.stages?.filter(notNull) ?? [];

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenditureStages;
