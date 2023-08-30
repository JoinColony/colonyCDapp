import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { TransactionsProps } from './types';
import { isTxGroup } from '~frame/GasStation/transactionGroup';
import { MessageType } from '~redux/immutable';
import TransactionDetails from './partials/TransactionDetails';
import EmptyContent from '~v5/common/EmptyContent';
import MessageCardDetails from '~frame/GasStation/MessageCardDetails';
import TransactionList from './partials/TransactionList';
import { useTransactionsListObserver } from './hooks';

import styles from './TransactionsTab.css';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = ({
  transactionAndMessageGroups,
  autoOpenTransaction,
  canLoadMoreTransactions,
  fetchMoreTransactions,
  setAutoOpenTransaction = () => {},
  appearance: { interactive },
}) => {
  const { formatMessage } = useIntl();
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    autoOpenTransaction ? 0 : -1,
  );

  const renderTransactions = () => {
    const unselectTransactionGroup = () => {
      setSelectedGroupIdx(-1);
      setAutoOpenTransaction(false);
    };
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    if (detailsTransactionGroup || !interactive) {
      if (isTxGroup(detailsTransactionGroup)) {
        return (
          <TransactionDetails transactionGroup={detailsTransactionGroup} />
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

  /* Load more when reaching end of list  */
  useTransactionsListObserver({
    canLoadMoreTransactions,
    fetchMoreTransactions,
    transactionAndMessageGroups,
  });

  return (
    <div className="flex flex-col w-full h-full">
      <p className="heading-5 mb-2.5 sm:mb-0.5">
        {formatMessage({ id: 'transactions' })}
      </p>
      <div
        id="transactionsListContainer"
        className={styles.transactionsListContainer}
      >
        {isEmpty ? (
          <EmptyContent
            title={{ id: 'empty.content.title.transactions' }}
            description={{ id: 'empty.content.subtitle.transactions' }}
            icon="binoculars"
          />
        ) : (
          renderTransactions()
        )}
      </div>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
