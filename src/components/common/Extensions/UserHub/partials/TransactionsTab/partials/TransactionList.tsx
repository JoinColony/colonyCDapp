import React, { type FC, useCallback, useState } from 'react';

import { type TransactionType } from '~redux/immutable/Transaction.ts';

import { getGroupId } from '../../../../../../../state/transactionState.ts';

import GroupedTransaction from './GroupedTransaction.tsx';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionList';

interface TransactionListProps {
  transactions: TransactionType[][];
}

const TransactionList: FC<TransactionListProps> = ({ transactions }) => {
  const newestGroup = transactions[0];
  const groupId = getGroupId(newestGroup);

  const [selectedGroupId, setGroupId] = useState<string | undefined>(undefined);

  const handleSelectElement = useCallback(
    (id: string) => {
      if (groupId === id) {
        setGroupId(undefined);
      } else {
        setGroupId(id);
      }
    },
    [groupId],
  );

  return (
    <ul>
      {transactions.map((tx) => {
        const gid = getGroupId(tx);
        return (
          <GroupedTransaction
            key={gid}
            transactionGroup={tx}
            onToggleExpand={handleSelectElement}
            isContentOpened={selectedGroupId === gid}
          />
        );
      })}
    </ul>
  );
};

TransactionList.displayName = displayName;

export default TransactionList;
