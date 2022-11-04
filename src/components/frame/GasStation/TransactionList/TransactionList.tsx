import React from 'react';

import CardList from '~shared/CardList';

import TransactionCard from '../TransactionCard';
import MessageCard from '../MessageCard';

import { TransactionType, MessageType } from '~redux/immutable';

import {
  TransactionOrMessageGroup,
  TransactionOrMessageGroups,
  getGroupId,
  isTxGroup,
} from '../transactionGroup';

interface Props {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  onClickGroup: (idx: number) => void;
}

const displayName = 'frame.GasStation.TransactionList';

const TransactionList = ({
  onClickGroup,
  transactionAndMessageGroups,
}: Props) => (
  <CardList
    appearance={{ numCols: '1' }}
    data-test="gasStationTransactionsList"
  >
    {transactionAndMessageGroups.map(
      (transactionOrMessageGroup: TransactionOrMessageGroup, idx: number) =>
        isTxGroup(transactionOrMessageGroup) ? (
          <TransactionCard
            key={getGroupId(transactionOrMessageGroup)}
            transactionGroup={transactionOrMessageGroup as TransactionType[]}
            onClick={onClickGroup}
            idx={idx}
          />
        ) : (
          <MessageCard
            key={getGroupId(transactionOrMessageGroup)}
            message={transactionOrMessageGroup[0] as MessageType}
            onClick={onClickGroup}
            idx={idx}
          />
        ),
    )}
  </CardList>
);

TransactionList.displayName = displayName;

export default TransactionList;
