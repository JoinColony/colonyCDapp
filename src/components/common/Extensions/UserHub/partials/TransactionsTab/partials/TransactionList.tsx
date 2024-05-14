import React, { type FC, useCallback, useState } from 'react';

import { useUserTransactionContext } from '~context/UserTransactionContext/UserTransactionContext.ts';
import MessageCard from '~frame/MessageCard/MessageCard.tsx';
import { type MessageType } from '~redux/immutable/index.ts';

import {
  type TransactionOrMessageGroup,
  getGroupId,
  isTxGroup,
} from '../transactionGroup.ts';

import GroupedTransaction from './GroupedTransaction.tsx';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionList';

const TransactionList: FC = () => {
  const { transactionAndMessageGroups } = useUserTransactionContext();

  const [groupId, setGroupId] = useState<string | undefined>(undefined);

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
      {transactionAndMessageGroups.map(
        (transactionOrMessageGroup: TransactionOrMessageGroup, idx: number) =>
          isTxGroup(transactionOrMessageGroup) ? (
            <GroupedTransaction
              key={getGroupId(transactionOrMessageGroup)}
              groupId={getGroupId(transactionOrMessageGroup)}
              transactionGroup={transactionOrMessageGroup}
              onToggleExpand={handleSelectElement}
              isContentOpened={
                groupId === getGroupId(transactionOrMessageGroup)
              }
            />
          ) : (
            <MessageCard
              key={getGroupId(transactionOrMessageGroup)}
              message={transactionOrMessageGroup[0] as MessageType}
              onClick={() => {}}
              idx={idx}
            />
          ),
      )}
    </ul>
  );
};

TransactionList.displayName = displayName;

export default TransactionList;
