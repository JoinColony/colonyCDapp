import React from 'react';
import { weiToEth } from '@web3-onboard/common';

import { Expenditure } from '~types';

import styles from './ExpenditureBalances.module.css';
import MaskedAddress from '~shared/MaskedAddress/MaskedAddress';

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
    </div>
  );
};

export default ExpenditureBalances;
