import { Binoculars } from '@phosphor-icons/react';
import React, { useRef, type FC } from 'react';

import { useGroupedTransactions } from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import InfiniteScrollTrigger from '~v5/common/InfiniteScrollLoader/index.ts';

import TransactionList from './partials/TransactionList.tsx';
import { type TransactionsProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { transactions, canFetchMore, fetchMore } = useGroupedTransactions();
  const isEmpty = !transactions.length;

  return (
    <div
      ref={containerRef}
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
        <InfiniteScrollTrigger
          canFetchMore={canFetchMore}
          containerRef={containerRef}
          fetchMore={fetchMore}
        />
      </div>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
