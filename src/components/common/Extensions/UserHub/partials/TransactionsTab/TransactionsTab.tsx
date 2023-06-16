import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { TransactionsProps } from './types';
import { isTxGroup } from '~frame/GasStation/transactionGroup';
import { MessageType, TransactionType } from '~redux/immutable';
import TransactionDetails from './partials/TransactionDetails';
import EmptyContent from '../EmptyContent';
import MessageCardDetails from '~frame/GasStation/MessageCardDetails/MessageCardDetails';
import TransactionList from './partials/TransactionList';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = ({
  transactionAndMessageGroups,
  autoOpenTransaction,
  setAutoOpenTransaction = () => {},
  appearance: { interactive },
}) => {
  const { formatMessage } = useIntl();
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    autoOpenTransaction ? 0 : -1,
  );

  const unselectTransactionGroup = () => {
    setSelectedGroupIdx(-1);
    setAutoOpenTransaction(false);
  };

  const renderTransactions = () => {
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    if (detailsTransactionGroup || !interactive) {
      const isTx = isTxGroup(detailsTransactionGroup);
      if (isTx) {
        return (
          <TransactionDetails
            transactionGroup={detailsTransactionGroup as TransactionType[]}
          />
        );
      }
      // @TODO: when handle this cases?
      return (
        <MessageCardDetails
          message={detailsTransactionGroup[0] as MessageType}
          onClose={unselectTransactionGroup}
        />
      );
    }

    return (
      <TransactionList
        transactionAndMessageGroups={transactionAndMessageGroups}
      />
    );
  };

  const isEmpty =
    !transactionAndMessageGroups || !transactionAndMessageGroups.length;

  return (
    <>
      <div className="flex items-center justify-between pb-4 relative">
        <div className="font-semibold text-lg">
          {formatMessage({ id: 'transactions' })}
        </div>
      </div>
      <ul>
        {isEmpty ? (
          <EmptyContent contentName="transactions" />
        ) : (
          renderTransactions()
        )}
      </ul>
    </>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
