import React, { FC, useCallback, useState } from 'react';

import MessageCard from '~frame/GasStation/MessageCard/MessageCard';
import {
  TransactionOrMessageGroup,
  getGroupId,
  isTxGroup,
} from '~frame/GasStation/transactionGroup';
import { MessageType } from '~redux/immutable';
import GroupedTransaction from './GroupedTransaction';
import { useUserTransactionContext } from '~context/UserTransactionContext';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionList';

const TransactionList: FC = () => {
  const [groupId, setGroupId] = useState<string | undefined>();

  const handleSelectElement = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  const { transactionAndMessageGroups } = useUserTransactionContext();

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
