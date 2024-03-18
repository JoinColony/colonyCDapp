import { type ApolloQueryResult } from '@apollo/client';
import { type ClientTypeTokens } from '@colony/colony-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { type TransactionOrMessageGroups } from '~common/Extensions/UserHub/partials/TransactionsTab/transactionGroup.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  type GetUserTransactionsQuery,
  useGetUserTransactionsQuery,
} from '~gql';
import { type TransactionType } from '~redux/immutable/index.ts';
import { groupedTransactions as groupedTransactionsSelector } from '~redux/selectors/index.ts';
import { type Transaction } from '~types/graphql.ts';
import { type ExtendedClientType } from '~types/transactions.ts';
import { notNull } from '~utils/arrays/index.ts';
import { groupBy, unionBy } from '~utils/lodash.ts';

export const TRANSACTION_LIST_PAGE_SIZE = 10;

const sortAndGroupTransactions = (transactions: Transaction[]) => {
  // Create groups of transations which have 'em
  const groupedTransactions = groupBy(transactions, 'groupId');
  const ungroupedTransactions = (groupedTransactions.undefined ?? [])
    .concat(groupedTransactions.null ?? [])
    .map((tx) => [tx]);

  // Sort groups by no in group
  for (const key of Object.keys(groupedTransactions)) {
    if (key !== 'undefined') {
      groupedTransactions[key].sort(
        // group should be defined here but optional chaining just in case
        (a, b) => (a?.group?.index ?? 0) - (b?.group?.index ?? 0),
      );
    }
  }

  const allTransactions = Object.entries(groupedTransactions)
    .filter(([key]) => key !== 'undefined' && key !== 'null')
    .map(([, value]) => value)
    .concat(ungroupedTransactions);

  // Finally sort by the createdAt field in the first transaction of the group
  allTransactions.sort(
    (a, b) =>
      new Date(b[0].createdAt).valueOf() - new Date(a[0].createdAt).valueOf(),
  );

  return allTransactions;
};

const convertTransactionType = ({
  context,
  createdAt,
  from,
  id,
  metatransaction,
  methodName,
  status,
  group,
  titleValues,
  hash,
  methodContext,
  params,
  title,
  options,
}: Transaction): TransactionType => {
  const txGroup = group
    ? {
        key: group.key,
        id: group.groupId,
        index: group.index,
        description: group.description
          ? JSON.parse(group.description)
          : undefined,
        descriptionValues: group.descriptionValues
          ? JSON.parse(group.descriptionValues)
          : undefined,
        title: group.title ? JSON.parse(group.title) : undefined,
        titleValues: group.titleValues
          ? JSON.parse(group.titleValues)
          : undefined,
      }
    : undefined;

  return {
    context: context as ClientTypeTokens | ExtendedClientType,
    createdAt: new Date(createdAt),
    from,
    id,
    metatransaction,
    methodName,
    status,
    group: txGroup,
    hash: hash ?? undefined,
    methodContext: methodContext ?? undefined,
    params: JSON.parse(params ?? '[]'),
    title: title ? JSON.parse(title) : undefined,
    titleValues: titleValues ? JSON.parse(titleValues) : undefined,
    options: options ? JSON.parse(options) : undefined,
  };
};

const updateQuery = (prev, { fetchMoreResult }) => {
  if (!fetchMoreResult.getTransactionsByUser) return prev;

  const mergedItems = unionBy(
    prev.getTransactionsByUser?.items ?? [],
    fetchMoreResult.getTransactionsByUser.items ?? [],
    'id',
  );

  return {
    getTransactionsByUser: {
      ...fetchMoreResult.getTransactionsByUser,
      items: mergedItems,
    },
  };
};

export const useGroupedTransactionsAndMessages = (): {
  transactionAndMessageGroups: TransactionOrMessageGroups;
  fetchMoreTransactions: () => void;
  canLoadMoreTransactions: boolean;
  refetchTransactions: () => Promise<
    ApolloQueryResult<GetUserTransactionsQuery>
  >;
} => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const [page, setPage] = useState(1);

  const visibleItems = TRANSACTION_LIST_PAGE_SIZE * page;

  const { walletAddress = '' } = user ?? {};

  const transactionGroups = useSelector(groupedTransactionsSelector);

  // @ts-ignore
  const currentTransactions: TransactionOrMessageGroups = useMemo(
    () => transactionGroups.toJS(),
    [transactionGroups],
  );

  // This is the oldest transaction in a user's session
  const transactionsOlderThan = currentTransactions
    .at(-1)?.[0]
    ?.createdAt?.toISOString();

  const { data, fetchMore, refetch } = useGetUserTransactionsQuery({
    variables: {
      userAddress: walletAddress,
      transactionsOlderThan,
      limit: TRANSACTION_LIST_PAGE_SIZE * 3,
    },
    skip: !colonyAddress || !walletAddress,
  });

  const { items, nextToken } = data?.getTransactionsByUser ?? {};

  const mergedTransactions = useMemo(() => {
    const transactions = items?.filter(notNull) ?? [];
    const groupedHistoricTransactions = sortAndGroupTransactions(transactions);
    return [
      ...currentTransactions,
      ...groupedHistoricTransactions.map((group) =>
        group.map(convertTransactionType),
      ),
    ];
  }, [items, currentTransactions]);

  useEffect(() => {
    if (mergedTransactions.length < visibleItems && nextToken) {
      fetchMore({ variables: { nextToken }, updateQuery });
    }
  }, [mergedTransactions, visibleItems, nextToken, fetchMore]);

  const visibleTransactions = useMemo(
    () => mergedTransactions.slice(0, visibleItems),
    [mergedTransactions, visibleItems],
  );

  const fetchMoreTransactions = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return {
    transactionAndMessageGroups: visibleTransactions,
    fetchMoreTransactions,
    refetchTransactions: refetch,
    canLoadMoreTransactions:
      mergedTransactions.length > visibleItems || !!nextToken,
  };
};
