import { useEffect, useRef } from 'react';

import { TX_PAGE_SIZE } from '../../../../../../state/transactionState.ts';

export const useTransactionsListObserver = () => {
  const lastListItem = useRef<Element | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  // const {
  //   canLoadMoreTransactions,
  //   fetchMoreTransactions,
  //   transactionAndMessageGroups,
  // } = useUserTransactionContext();

  useEffect(
    () => {
      const root = document.querySelector('#transactionsListContainer');

      if (!observer.current) {
        observer.current = new IntersectionObserver(
          ([entry]) => {
            const alreadyFetched = !!entry.target.getAttribute('data-fetched');

            if (entry.isIntersecting && !alreadyFetched) {
              // fetchMoreTransactions();
              entry.target.setAttribute('data-fetched', 'true');
              observer.current?.unobserve(entry.target);
            }
          },
          {
            root,
          },
        );
      }

      const nextFetchNode = root?.querySelector(
        `ul > li:nth-last-child(${Math.floor(TX_PAGE_SIZE / 2)})`,
      );

      if (lastListItem.current) {
        observer.current.unobserve(lastListItem.current);
      }

      if (nextFetchNode) {
        lastListItem.current = nextFetchNode;
        observer.current.observe(nextFetchNode);
      }

      // if (!canLoadMoreTransactions) {
      //   observer.current.disconnect();
      // }

      return () => {
        observer.current?.disconnect();
      };
    },
    [
      // canLoadMoreTransactions,
      // transactionAndMessageGroups,
      // fetchMoreTransactions,
    ],
  );
};
