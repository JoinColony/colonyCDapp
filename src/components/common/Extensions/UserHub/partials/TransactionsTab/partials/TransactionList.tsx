import React, { FC, useCallback, useState } from 'react';

import { useUserTransactionContext } from '~context/UserTransactionContext.tsx';
import MessageCard from '~frame/MessageCard/MessageCard.tsx';
import { MessageType } from '~redux/immutable/index.ts';

import {
  TransactionOrMessageGroup,
  getGroupId,
  isTxGroup,
} from '../transactionGroup.ts';

import GroupedTransaction from './GroupedTransaction.tsx';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionList';

const TransactionList: FC = () => {
  const { transactionAndMessageGroups } = useUserTransactionContext();

  const [groupId, setGroupId] = useState<string | undefined>(
    getGroupId(transactionAndMessageGroups[0]),
  );

  const handleSelectElement = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  return (
    <ul>
      {transactionAndMessageGroups.map(
        (transactionOrMessageGroup: TransactionOrMessageGroup, idx: number) =>
          isTxGroup(transactionOrMessageGroup) ? (
            <GroupedTransaction
              key={getGroupId(transactionOrMessageGroup)}
              groupId={getGroupId(transactionOrMessageGroup)}
              transactionGroup={transactionOrMessageGroup}
              onClick={handleSelectElement}
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
