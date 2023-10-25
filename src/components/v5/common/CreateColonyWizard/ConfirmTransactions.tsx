import React from 'react';

import GasStationContent from '~frame/GasStation/GasStationContent';
import { TransactionOrMessageGroup } from '~frame/GasStation/transactionGroup';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

interface ConfirmTransactionsProps {
  transactionGroup?: TransactionOrMessageGroup;
}
const ConfirmTransactions = ({
  transactionGroup,
}: ConfirmTransactionsProps) => (
  <div className="">
    {transactionGroup && (
      <GasStationContent
        appearance={{ interactive: false, required: true }}
        transactionAndMessageGroups={[transactionGroup]}
      />
    )}
  </div>
);

ConfirmTransactions.displayName = displayName;

export default ConfirmTransactions;
