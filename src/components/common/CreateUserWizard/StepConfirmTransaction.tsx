import React from 'react';
import { useSelector } from 'react-redux';
import { defineMessages } from 'react-intl';

import { groupedTransactionsAndMessages } from '~redux/selectors';
import {
  findTransactionGroupByKey,
  TransactionOrMessageGroups,
} from '~frame/GasStation/transactionGroup';
import ConfirmTransactions from '~shared/Wizard/ConfirmTransactions';

import styles from './StepConfirmTransaction.css';

const displayName = 'common.CreateUserWizard.StepConfirmTransaction';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: `Complete this transaction to create your username`,
  },
});

const StepConfirmTransaction = () => {
  const txGroups = useSelector(
    groupedTransactionsAndMessages,
  ).toJS() as TransactionOrMessageGroups;

  const colonyTransaction = findTransactionGroupByKey(
    txGroups,
    'group.transaction.batch.createUser',
  );

  return (
    <section className={styles.main}>
      <ConfirmTransactions
        transactionGroup={colonyTransaction}
        headingText={MSG.heading}
      />
    </section>
  );
};

StepConfirmTransaction.displayName = displayName;

export default StepConfirmTransaction;
