import { weiToEth } from '@web3-onboard/common';
import React from 'react';

import MaskedAddress from '~shared/MaskedAddress/MaskedAddress';
import { Expenditure } from '~types';
import { isExpenditureFunded } from '~utils/expenditures';

import styles from './ExpenditureBalances.module.css';

interface ExpenditureBalancesProps {
  expenditure: Expenditure;
}

const ExpenditureBalances = ({ expenditure }: ExpenditureBalancesProps) => {
  return (
    <div>
      <div>Balances</div>
      <div className={styles.balances}>
        {expenditure.balances?.map((balance) => (
          <div key={balance.tokenAddress} className={styles.balance}>
            <div>
              <div>Token address</div>
              <MaskedAddress address={balance.tokenAddress} />
            </div>
            <div>
              <div>Balance</div>
              <div>
                {weiToEth(balance.amount)}/{weiToEth(balance.requiredAmount)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        Is fully funded: {isExpenditureFunded(expenditure) ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default ExpenditureBalances;
