import { type MutationOptions, type FetchPolicy } from '@apollo/client';
import { type ClientTypeTokens } from '@colony/colony-js';
import { utils } from 'ethers';
import { useMemo } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  useGetUserTransactionsQuery,
  type ClientType,
  CreateTransactionDocument,
  type CreateTransactionMutation,
  type CreateTransactionMutationVariables,
  GetTransactionDocument,
  type GetTransactionQuery,
  type GetTransactionQueryVariables,
  TransactionStatus,
  UpdateTransactionDocument,
  type UpdateTransactionMutation,
  type UpdateTransactionMutationVariables,
  type GetUserTransactionsQuery,
  type GetUserTransactionsQueryVariables,
  GetUserTransactionsDocument,
  type GetPendingTransactionsQuery,
  type GetPendingTransactionsQueryVariables,
  GetPendingTransactionsDocument,
} from '~gql';
import { type TransactionType } from '~redux/immutable/index.ts';
import { type TransactionCreatedPayload } from '~redux/types/actions/transaction.ts';
import { type AddressOrENSName } from '~types';
import { type Transaction } from '~types/graphql.ts';
import {
  type MethodParams,
  type ExtendedClientType,
} from '~types/transactions.ts';
import { notNull } from '~utils/arrays/index.ts';
import { filter, groupBy, mapValues, orderBy } from '~utils/lodash.ts';

export const TX_PAGE_SIZE = 20;

const convertTransactionType = ({
  context,
  createdAt,
  error,
  from,
  group,
  groupId,
  hash,
  id,
  identifier,
  metatransaction,
  methodContext,
  methodName,
  params,
  status,
  title,
  titleValues,
  options,
}: Transaction): TransactionType => {
  const txGroup = {
    key: group.key,
    id: group.groupId,
    index: group.index,
    description: group.description ? JSON.parse(group.description) : undefined,
    descriptionValues: group.descriptionValues
      ? JSON.parse(group.descriptionValues)
      : undefined,
    title: group.title ? JSON.parse(group.title) : undefined,
    titleValues: group.titleValues ? JSON.parse(group.titleValues) : undefined,
  };

  return {
    context: context as ClientTypeTokens | ExtendedClientType,
    createdAt: new Date(createdAt),
    error: error ?? undefined,
    from,
    id,
    identifier: identifier as AddressOrENSName,
    metatransaction,
    methodName,
    status,
    group: txGroup,
    groupId,
    hash: hash || '0x0',
    methodContext: methodContext ?? undefined,
    params: JSON.parse(params ?? '[]'),
    title: title ? JSON.parse(title) : undefined,
    titleValues: titleValues ? JSON.parse(titleValues) : undefined,
    options: options ? JSON.parse(options) : undefined,
  };
};

export enum TransactionGroupStatus {
  Loading = 'Loading',
  NonePending = 'NonePending',
  SomePending = 'SomePending',
  SomeFailed = 'SomeFailed',
  AllCompleted = 'AllCompleted',
}

// Get the joint status of one transaction group
export const getGroupStatus = (txGroup: TransactionType[]) => {
  if (!txGroup) {
    throw new Error('this should not happen');
  }
  if (txGroup.some((tx) => tx.status === TransactionStatus.Failed)) {
    return TransactionStatus.Failed;
  }
  if (txGroup.some((tx) => tx.status === TransactionStatus.Pending)) {
    return TransactionStatus.Pending;
  }
  if (txGroup.every((tx) => tx.status === TransactionStatus.Succeeded)) {
    return TransactionStatus.Succeeded;
  }
  if (txGroup.some((tx) => tx.status === TransactionStatus.Ready)) {
    return TransactionStatus.Ready;
  }
  return TransactionStatus.Created;
};

// Get the joint status of all transaction groups (here it's only relevant if some are pending or not)
export const getGroupStatusAll = (
  txGroup: TransactionType[][],
  loading: boolean,
) => {
  if (loading) {
    return TransactionGroupStatus.Loading;
  }
  if (
    txGroup.some((group) =>
      group.some((tx) => tx.status === TransactionStatus.Pending),
    )
  ) {
    return TransactionGroupStatus.SomePending;
  }
  return TransactionGroupStatus.NonePending;
};

// Get the index of the first transaction in a group that is ready to sign
export const getActiveTransactionIdx = (txGroup: TransactionType[]) => {
  // Select the pending selection so that the user can't sign the next one
  const pendingTransactionIdx = txGroup.findIndex(
    (tx) => tx.status === TransactionStatus.Pending,
  );
  if (pendingTransactionIdx > -1) return pendingTransactionIdx;
  return txGroup.findIndex(
    (tx) =>
      tx.status === TransactionStatus.Ready ||
      tx.status === TransactionStatus.Failed,
  );
};

// Get transaction values to show in title or description
export const getGroupValues = <T>(
  txGroup: T[], // For now, just returns the first transaction if we have one
) => txGroup[0];

export const getGroupId = (txGroup: TransactionType[]) => txGroup[0].group.id;

export const getGroupKey = (txGroup: TransactionType[]) => txGroup[0].group.key;

export const findTransactionGroupByKey = (
  txGroups: TransactionType[][],
  key: string,
) => txGroups.find((txGroup) => txGroup[0].group.key === key);

// Get count of all transactions in the redux store
export const transactionCount = (transactions: TransactionType[]) =>
  transactions.flatMap((tx) => tx).length;

export const useGroupedTransactions = () => {
  const { user } = useAppContext();
  const userAddress = utils.getAddress(user?.walletAddress as string);
  const { data, loading } = useGetUserTransactionsQuery({
    variables: {
      userAddress,
      limit: TX_PAGE_SIZE,
    },
    skip: !user,
  });

  const transactions = useMemo(() => {
    const rawTransactions =
      data?.getTransactionsByUser?.items.map(convertTransactionType) || [];
    return filter(
      mapValues(
        // Group transactions by groupId
        groupBy(rawTransactions, 'groupId'),
        // Map each group to be sorted by group.index
        (group) => orderBy(group, [(item) => item?.group?.index], ['asc']),
      ),
      // Filter all items that do not contain a transaction of index 0
      // (this means they were cut off within the group)
      (group) => !!group.find((item) => item?.group?.index === 0),
      // Finally we sort the resulting array of arrays by the createdAt value of the first transaction within a group (descending)
    ).sort(
      (groupA, groupB) =>
        new Date(groupB[0]?.createdAt || 0).valueOf() -
        new Date(groupA[0]?.createdAt || 0).valueOf(),
    );
  }, [data?.getTransactionsByUser?.items]);

  const groupState = getGroupStatusAll(transactions, loading);

  return { groupState, transactions, loading };
};

export const getTransaction = async (id: string, fetchPolicy?: FetchPolicy) => {
  // Get the transaction from apollo
  const apolloClient = getContext(ContextModule.ApolloClient);

  const { data } = await apolloClient.query<
    GetTransactionQuery,
    GetTransactionQueryVariables
  >({
    query: GetTransactionDocument,
    variables: { id },
    fetchPolicy,
  });

  if (!data.getTransaction) {
    throw new Error('Transaction not found.');
  }
  return convertTransactionType(data.getTransaction);
};

export const fetchTransaction = async ({ id }) => {
  const apollo = getContext(ContextModule.ApolloClient);
  return apollo.query<GetTransactionQuery, GetTransactionQueryVariables>({
    query: GetTransactionDocument,
    variables: { id },
  });
};

export const addTransactionToDb = async (
  id: string,
  {
    context,
    createdAt,
    from,
    group,
    identifier,
    methodContext,
    methodName,
    options = {},
    params,
    status,
    title,
    titleValues,
    metatransaction,
  }: TransactionCreatedPayload,
) => {
  let colonyAddress = '0x';
  try {
    // @TODO: ultimately we should get rid of this (once sagas are out)
    colonyAddress = getContext(ContextModule.CurrentColonyAddress);
  } catch {
    // If we don't have a colony address, we're creating a colony.
    // The correct address will be added to the transactions in the colony create saga
  }

  const fromAddress = utils.getAddress(from);

  // Apollo needs the null values to be there (for the optimistic response - it doesn't like undefined)
  const txGroup = {
    id: `${group.id}-${group.index}`,
    groupId: group.id.toString(),
    index: group.index,
    key: group.key,
    description: JSON.stringify(group.description) || null,
    descriptionValues: JSON.stringify(group.descriptionValues) || null,
    title: JSON.stringify(group.title) || null,
    titleValues: JSON.stringify(group.titleValues) || null,
  };

  const txCreatedAt = createdAt.toISOString();
  const txParams = JSON.stringify(params || []);

  const apollo = getContext(ContextModule.ApolloClient);

  const input = {
    id,
    context: context as ClientType,
    createdAt: txCreatedAt,
    error: null,
    from: fromAddress,
    colonyAddress,
    groupId: group.id,
    group: txGroup,
    hash: null,
    methodContext: methodContext || null,
    methodName,
    status,
    metatransaction,
    title: JSON.stringify(title) || null,
    titleValues: JSON.stringify(titleValues) || null,
    params: txParams,
    identifier: identifier || null,
    options: JSON.stringify(options),
  };

  await apollo.mutate<
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >({
    mutation: CreateTransactionDocument,
    variables: {
      input,
    },
    update: (cache, { data }) => {
      const newTx = data?.createTransaction;

      if (!newTx) {
        return;
      }

      cache.updateQuery<
        GetUserTransactionsQuery,
        GetUserTransactionsQueryVariables
      >(
        {
          query: GetUserTransactionsDocument,
          variables: {
            userAddress: fromAddress,
            limit: TX_PAGE_SIZE,
          },
        },
        (result) => {
          if (!result?.getTransactionsByUser) {
            return result;
          }

          return {
            ...result,
            getTransactionsByUser: {
              ...result.getTransactionsByUser,
              items: [newTx, ...result.getTransactionsByUser.items],
            },
          };
        },
      );
    },
    optimisticResponse: {
      createTransaction: {
        __typename: 'Transaction',
        ...input,
        group: {
          __typename: 'TransactionGroup',
          ...input.group,
        },
      },
    },
  });
};

export const updateTransaction = async (
  input: Omit<UpdateTransactionMutationVariables['input'], 'from'>,
  optimisticResponse?: UpdateTransactionMutation['updateTransaction'],
) => {
  const apollo = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);

  const mutationOpts: MutationOptions<
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  > = {
    mutation: UpdateTransactionDocument,
    variables: {
      input: {
        ...input,
        from: walletAddress,
      },
    },
  };
  if (optimisticResponse) {
    mutationOpts.optimisticResponse = {
      updateTransaction: {
        __typename: 'Transaction',
        // null values for optimistic response
        error: null,
        identifier: null,
        params: null,
        deleted: optimisticResponse.deleted || false,
        ...optimisticResponse,
      },
    };
  }

  return apollo.mutate<
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  >(mutationOpts);
};

export const deleteTransaction = async (id: string) => {
  const apollo = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  await apollo.mutate<
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  >({
    mutation: UpdateTransactionDocument,
    variables: {
      input: {
        id,
        from: walletAddress,
        status: TransactionStatus.Failed,
        deleted: true,
      },
    },
    optimisticResponse: {
      updateTransaction: {
        __typename: 'Transaction',
        id,
        deleted: true,
        status: TransactionStatus.Failed,
        // null values for optimistic response
        error: null,
        identifier: null,
        params: null,
      },
    },
    update: (cache, { data }) => {
      const newTx = data?.updateTransaction;

      if (!newTx) {
        return;
      }

      cache.updateQuery<
        GetUserTransactionsQuery,
        GetUserTransactionsQueryVariables
      >(
        {
          query: GetUserTransactionsDocument,
          variables: {
            userAddress: walletAddress,
            limit: TX_PAGE_SIZE,
          },
        },
        (result) => {
          if (!result?.getTransactionsByUser) {
            return result;
          }

          return {
            ...result,
            getTransactionsByUser: {
              ...result.getTransactionsByUser,
              items: result.getTransactionsByUser.items.filter(
                (tx) => tx?.id !== id,
              ),
            },
          };
        },
      );
    },
  });
};

// Update the transaction status to ready in the database (important before sending it!)
export const transactionSetReady = async (id: string) => {
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const input = {
    id,
    from: walletAddress,
    status: TransactionStatus.Ready,
  };
  return updateTransaction(input, input);
};

// Update the transaction indentifier asynchronously (important before sending it!)
export const transactionSetIdentifier = async (
  id: string,
  identifier: string,
) => {
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const input = {
    id,
    from: walletAddress,
    identifier,
  };
  return updateTransaction(input, {
    ...input,
    status: TransactionStatus.Pending,
  });
};

// Update the transaction params asynchronously (important before sending it!)
export const transactionSetParams = async (
  id: string,
  params: MethodParams,
) => {
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const input = {
    id,
    from: walletAddress,
    params: JSON.stringify(params),
  };
  return updateTransaction(input, {
    ...input,
    status: TransactionStatus.Pending,
  });
};

// Set the transaction back to pending, remove any error
export const transactionRetry = async (id: string) => {
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const input = {
    id,
    from: walletAddress,
    status: TransactionStatus.Ready,
    error: null,
  };
  return updateTransaction(input, input);
};

export const failPendingTransactions = async () => {
  const wallet = getContext(ContextModule.Wallet);
  const userAddress = utils.getAddress(wallet.address);
  const apollo = getContext(ContextModule.ApolloClient);

  const { data } = await apollo.query<
    GetPendingTransactionsQuery,
    GetPendingTransactionsQueryVariables
  >({
    query: GetPendingTransactionsDocument,
    variables: {
      userAddress,
    },
  });

  const promises = data.getTransactionsByUser?.items
    .filter(notNull)
    .map((tx) => {
      return updateTransaction(
        {
          id: tx.id,
          status: TransactionStatus.Failed,
        },
        // Optimisitc response, for quick UI updates
        {
          id: tx.id,
          status: TransactionStatus.Failed,
        },
      );
    });

  if (!promises) {
    return;
  }

  await Promise.allSettled(promises);
};
