import React from 'react';

import GasStationContent from '~frame/GasStation/GasStationContent';
import { TransactionOrMessageGroup } from '~frame/GasStation/transactionGroup';
import Heading from '~shared/Heading';
import { Message } from '~types';

import styles from './ConfirmTransactions.css';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

interface ConfirmTransactionsProps {
  transactionGroup?: TransactionOrMessageGroup;
  headingText: Message;
}
const ConfirmTransactions = ({ transactionGroup, headingText }: ConfirmTransactionsProps) => (
  <>
    <Heading appearance={{ size: 'medium', weight: 'medium' }} text={headingText} />
    <div className={styles.container}>
      {transactionGroup && (
        <GasStationContent
          appearance={{ interactive: false, required: true }}
          transactionAndMessageGroups={[transactionGroup]}
        />
      )}
    </div>
  </>
);

ConfirmTransactions.displayName = displayName;

export default ConfirmTransactions;
