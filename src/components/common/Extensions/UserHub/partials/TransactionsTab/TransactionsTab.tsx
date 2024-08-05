import { Binoculars, Smiley } from '@phosphor-icons/react';
import { useInView } from 'framer-motion';
import React, { useRef, type FC, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';

import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { useGroupedTransactions } from '~state/transactionState.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';

import TransactionList from './partials/TransactionList.tsx';
import { type TransactionsProps } from './types.ts';

const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const MSG = defineMessages({
  thisIsTheEnd: {
    id: `${displayName}.thisIsTheEnd`,
    defaultMessage: 'No more results',
  },
});

const TransactionsTab: FC<TransactionsProps> = () => {
  const { transactions, canFetchMore, fetchMore, onePageOnly } =
    useGroupedTransactions();
  const containerNode = useRef(null);
  const endNode = useRef<HTMLDivElement>(null);
  const isInView = useInView(endNode, { root: containerNode });
  const [isFetching, setIsFetching] = useState(false);
  const isEmpty = !transactions.length;

  useEffect(() => {
    if (isInView && !isFetching) {
      setIsFetching(true);
      fetchMore().then(
        () => setIsFetching(false),
        () => setIsFetching(false),
      );
    }
    // We are not including fetchMore here as we really only want to react to changes of isInView
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

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
        <div
          ref={endNode}
          className="flex items-center justify-center px-6 pb-4 pt-2 text-sm"
        >
          {canFetchMore ? (
            <>
              <SpinnerLoader />
              <span className="mx-2">
                {formatText(
                  { id: 'status.loading' },
                  { optionalText: ' more' },
                )}
              </span>
            </>
          ) : (
            !onePageOnly && (
              <div className="text-gray-400">
                <Smiley className="mr-1 inline-block" />
                <span className="text-xs">{formatText(MSG.thisIsTheEnd)}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

TransactionsTab.displayName = displayName;

export default TransactionsTab;
