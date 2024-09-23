import { Binoculars } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import useInfiniteScroll from '~hooks/useInfiniteScroll.tsx';
import { useGroupedTransactions } from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';

import TransactionList from './partials/TransactionList.tsx';
import { type TransactionsProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = () => {
  const { transactions, canFetchMore, fetchMore, onePageOnly } =
    useGroupedTransactions();
  const { containerNode, InfiniteScrollTrigger } = useInfiniteScroll({
    canFetchMore,
    isSinglePage: onePageOnly,
    fetchMore,
  });
  const isEmpty = !transactions.length;

  return (
    <div
      ref={containerNode}
      className="flex h-full w-full flex-col overflow-auto"
    >
      <p className="px-6 pt-6 heading-5">
        {formatText({ id: 'transactions' })}
      </p>
      <div className="h-full w-full px-6 sm:px-0">
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
        {InfiniteScrollTrigger}
      </div>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
