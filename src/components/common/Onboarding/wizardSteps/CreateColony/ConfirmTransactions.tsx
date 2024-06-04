import React from 'react';
import { defineMessages } from 'react-intl';

import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction.tsx';
import {
  type TransactionOrMessageGroup,
  getGroupStatus,
} from '~common/Extensions/UserHub/partials/TransactionsTab/transactionGroup.ts';
import { TransactionStatus } from '~gql';
import { type TransactionType } from '~redux/immutable/Transaction.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

const MSG = defineMessages({
  loadingColony: {
    id: `${displayName}.loadingColony`,
    defaultMessage: `Waiting for your colony to exist ...`,
  },
});

interface ConfirmTransactionsProps {
  transactionGroup?: TransactionOrMessageGroup;
}

const ConfirmTransactions = ({
  transactionGroup,
}: ConfirmTransactionsProps) => {
  if (transactionGroup) {
    const transactionGroupStatus = getGroupStatus(transactionGroup);
    return (
      <>
        <GroupedTransaction
          transactionGroup={transactionGroup as TransactionType[]}
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
  }

  return null;
};

ConfirmTransactions.displayName = displayName;

export default ConfirmTransactions;
