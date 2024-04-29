import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction.tsx';
import { TransactionStatus } from '~gql';
import { type TransactionType } from '~redux/immutable/Transaction.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';

import { getGroupStatus } from '../../../../../state/transactionState.ts';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

const MSG = defineMessages({
  loadingColony: {
    id: `${displayName}.loadingColony`,
    defaultMessage: `Waiting for your colony to exist ...`,
  },
});

interface ConfirmTransactionsProps {
  transactions: TransactionType[];
}

const ConfirmTransactions = ({ transactions }: ConfirmTransactionsProps) => {
  const transactionGroupStatus = useMemo(
    () => getGroupStatus(transactions),
    [transactions],
  );
  return (
    <>
      <GroupedTransaction
        transactionGroup={transactions}
        isContentOpened
        hideSummary
        isClickable={false}
      />
      {transactionGroupStatus === TransactionStatus.Succeeded && (
        <div className="mt-8 text-center text-sm text-gray-600">
          <SpinnerLoader />
          <span className="ml-2 align-text-bottom">
            {formatText(MSG.loadingColony)}
          </span>
        </div>
      )}
    </>
  );
};

ConfirmTransactions.displayName = displayName;

export default ConfirmTransactions;
