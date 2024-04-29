import { Binoculars } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';

import { useGroupedTransactions } from '../../../../../../state/transactionState.ts';

import { useTransactionsListObserver } from './hooks.ts';
import TransactionList from './partials/TransactionList.tsx';
import { type TransactionsProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = () =>
  // {
  //   appearance: { interactive },
  // }
  {
    // const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    //   isLatestTxPending ? 0 : -1,
    // );

    // const renderTransactions = () => {
    //   const unselectTransactionGroup = () => {
    //     setSelectedGroupIdx(-1);
    //   };
    //   let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    //   if (!interactive && selectedGroupIdx === -1) {
    //     [detailsTransactionGroup] = transactionAndMessageGroups;
    //   }

    //   if (detailsTransactionGroup || !interactive) {
    //     if (isTxGroup(detailsTransactionGroup)) {
    //       return (
    //         <TransactionDetails transactionGroup={detailsTransactionGroup} />
    //       );
    //     }
    //     // @TODO: when handle this cases?
    //     return (
    //       <MessageCardDetails
    //         message={detailsTransactionGroup[0] as MessageType}
    //         onClose={unselectTransactionGroup}
    //       />
    //     );
    //   }

    //   return;
    // };

    const { transactions } = useGroupedTransactions();
    const isEmpty = !transactions.length;

    /* Load more when reaching end of list  */
    useTransactionsListObserver();

    return (
      <div className="flex h-full w-full flex-col overflow-auto">
        <p className="px-6 pt-6 heading-5">
          {formatText({ id: 'transactions' })}
        </p>
        <div
          className="h-full w-full px-6 sm:px-0"
          id="transactionsListContainer"
        >
          {isEmpty ? (
            <EmptyContent
              title={{ id: 'empty.content.title.transactions' }}
              description={{ id: 'empty.content.subtitle.transactions' }}
              icon={Binoculars}
              className="h-full"
            />
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </div>
      </div>
    );
  };

TransactionsTab.displayName = displayName;

export default TransactionsTab;
