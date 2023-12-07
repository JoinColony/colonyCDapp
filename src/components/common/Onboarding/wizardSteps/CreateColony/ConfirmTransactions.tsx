import React from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import GroupedTransaction from '~common/Extensions/UserHub/partials/TransactionsTab/partials/GroupedTransaction';
import {
  TransactionOrMessageGroup,
  getGroupStatus,
} from '~frame/GasStation/transactionGroup';
import { TransactionStatus } from '~gql';
import { TransactionType } from '~redux/immutable/Transaction';
import { formatText } from '~utils/intl';

const displayName = 'common.CreateColonyWizard.ConfirmTransactions';

const MSG = defineMessages({
  loadingColony: {
    id: `${displayName}.loadingColony`,
    defaultMessage: `Waiting for Colony to exist ...`,
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
          hideButton
        />
        {transactionGroupStatus === TransactionStatus.Succeeded && (
          <div className="text-sm text-center text-gray-600 mt-8">
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
