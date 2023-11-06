import React from 'react';

import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction';
import { TransactionOrMessageGroup } from '~frame/GasStation/transactionGroup';
import { TransactionType } from '~redux/immutable/Transaction';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

interface ConfirmTransactionsProps {
  transactionGroup?: TransactionOrMessageGroup;
}
const ConfirmTransactions = ({
  transactionGroup,
}: ConfirmTransactionsProps) => {
  if (transactionGroup) {
    return (
      <GroupedTransaction
        transactionGroup={transactionGroup as TransactionType[]}
        isContentOpened
        hideButton
      />
    );
  }

  return null;
};

ConfirmTransactions.displayName = displayName;

export default ConfirmTransactions;
