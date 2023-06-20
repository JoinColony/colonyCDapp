import React, { FC, useCallback, useState } from 'react';

import MessageCard from '~frame/GasStation/MessageCard/MessageCard';
import {
  TransactionOrMessageGroup,
  getGroupId,
  isTxGroup,
} from '~frame/GasStation/transactionGroup';
import { MessageType, TransactionType } from '~redux/immutable';
import GroupedTransaction from './GroupedTransaction';
import { TransactionListProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.TransactionTab.partials.TransactionList';

const TransactionList: FC<TransactionListProps> = ({
  transactionAndMessageGroups,
}) => {
  const [groupId, setGroupId] = useState<string | undefined>();

  const handleSelectElement = useCallback((id: string) => {
    setGroupId(id);
  }, []);

  return (
    <ul className="max-h-[31.25rem] overflow-y-scroll relative">
      {transactionAndMessageGroups.map(
        (transactionOrMessageGroup: TransactionOrMessageGroup, idx: number) =>
          isTxGroup(transactionOrMessageGroup) ? (
            <GroupedTransaction
              key={getGroupId(transactionOrMessageGroup)}
              groupId={getGroupId(transactionOrMessageGroup)}
              transactionGroup={transactionOrMessageGroup as TransactionType[]}
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
