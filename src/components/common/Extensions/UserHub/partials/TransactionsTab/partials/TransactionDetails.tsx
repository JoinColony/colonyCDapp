import React, { FC } from 'react';

import { getActiveTransactionIdx } from '~frame/GasStation/transactionGroup';

import { TransactionType } from '~redux/immutable';
import GroupedTransaction from './GroupedTransaction';
import { TransactionDetailsProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionDetails';

const TransactionDetails: FC<TransactionDetailsProps> = ({
  unselectTransactionGroup,
  transactionGroup,
  appearance,
}) => {
  // const { interactive } = appearance;
  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;
  const selectedTransaction = transactionGroup[selectedTransactionIdx];

  return (
    <ul>
      <GroupedTransaction
        appearance={appearance}
        transactionGroup={transactionGroup}
        selectedTransactionIdx={selectedTransactionIdx}
        selectedTransaction={selectedTransaction as TransactionType}
        unselectTransactionGroup={unselectTransactionGroup}
      />
    </ul>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
