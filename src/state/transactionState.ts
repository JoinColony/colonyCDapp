import { type MutationOptions, type FetchPolicy } from '@apollo/client';
import { type ClientTypeTokens } from '@colony/colony-js';
import { utils, BigNumber } from 'ethers';
import { useMemo } from 'react';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
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
  type CreateTransactionInput,
  InitializeUserDocument,
  type InitializeUserMutation,
  type InitializeUserMutationVariables,
} from '~gql';
import { type TransactionType } from '~redux/immutable/index.ts';
import { onTransactionPending } from '~redux/sagas/transactions/transactionsToDb.ts';
import { type TransactionCreatedPayload } from '~redux/types/actions/transaction.ts';
import { type AddressOrENSName } from '~types';
import { type Transaction } from '~types/graphql.ts';
import {
  type MethodParams,
  type ExtendedClientType,
} from '~types/transactions.ts';
import { filter, groupBy, mapValues, orderBy } from '~utils/lodash.ts';

import { DEFAULT_TX_HASH } from './consts.ts';

export const TX_PAGE_SIZE = 20;

export const convertTransactionType = ({
  associatedActionId,
  colonyAddress,
  context,
  createdAt,
  error,
  from,
  group,
  groupId,
  hash,
  id,
  identifier,
  methodContext,
  methodName,
  params,
  status,
  title,
  titleValues,
  options,
  gasLimit,
  gasPrice,
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

  const convertedParams = JSON.parse(params ?? '[]').map((param) => {
    // @NOTE Try to convert BigNumber params back to Ethers BigNumber
    //
    // When the transaction gets saved in the database, the BigNumber objects get stringified
    // meaning it will loose its BigNumber properties and prototypes
    // Converting it back will create an Object shaped like a BigNumber, but it won't have the prototype, hence
    // it won't be a proper BigNumber object, and won't have the methods like add, sub, etc.
    //
    // Here we're trying to convert it back to a Ethers BigNumber object by "trying to be smart" and checking if
    // the object has a "tyhpe" property, with the value "BigNumber" (which is what Ethers uses), as well as a "hex" property
    if (param?.type === 'BigNumber' && param?.hex) {
      return BigNumber.from(param);
    }
    return param;
  });

  const parsedOptions = JSON.parse(options ?? '{}');
  Object.keys(parsedOptions).map((key) => {
    // @NOTE Try to convert BigNumber option object values back to Ethers BigNumber
    //
    // This is the same as the params one above, just that it deals with an nested object, rather than an array
    //
    // When the transaction gets saved in the database, the BigNumber objects get stringified
    // meaning it will loose its BigNumber properties and prototypes
    // Converting it back will create an Object shaped like a BigNumber, but it won't have the prototype, hence
    // it won't be a proper BigNumber object, and won't have the methods like add, sub, etc.
    //
    // Here we're trying to convert it back to a Ethers BigNumber object by "trying to be smart" and checking if
    // the object has a "type" property, with the value "BigNumber" (which is what Ethers uses), as well as a "hex" property
    if (parsedOptions[key]?.type === 'BigNumber' && parsedOptions[key]?.hex) {
      parsedOptions[key] = BigNumber.from(parsedOptions[key]);
    }
    return parsedOptions[key];
  });

  return {
    context: context as ClientTypeTokens | ExtendedClientType,
    colonyAddress,
    createdAt: new Date(createdAt),
    error: error ?? undefined,
    from,
    id,
    identifier: identifier as AddressOrENSName,
    methodName,
    status,
    group: txGroup,
    groupId,
    hash: hash || DEFAULT_TX_HASH,
    methodContext: methodContext ?? undefined,
    params: convertedParams,
    title: title ? JSON.parse(title) : undefined,
    titleValues: titleValues ? JSON.parse(titleValues) : undefined,
    options: parsedOptions,
    associatedActionId: associatedActionId ?? undefined,
    gasLimit,
    gasPrice,
  };
};

// Get the joint status of one transaction group
export const getGroupStatus = (txGroup: TransactionType[]) => {
  if (txGroup.some((tx) => tx.status === TransactionStatus.Failed)) {
    return TransactionStatus.Failed;
  }
  if (txGroup.every((tx) => tx.status === TransactionStatus.Succeeded)) {
    return TransactionStatus.Succeeded;
  }
  return TransactionStatus.Pending;
};

export const getHasZeroAddressTransaction = (txGroup: TransactionType[]) =>
  txGroup.some((tx) => tx.hash === DEFAULT_TX_HASH);

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
  const { data, fetchMore: fetchMoreApollo } = useGetUserTransactionsQuery({
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

  const fetchMore = async () => {
    const nextToken = data?.getTransactionsByUser?.nextToken;
    if (!nextToken) {
      return;
    }
    await fetchMoreApollo({
      variables: {
        nextToken,
      },
    });
  };

  return {
    canFetchMore: !!data?.getTransactionsByUser?.nextToken,
    fetchMore,
    onePageOnly: transactions.length <= TX_PAGE_SIZE,
    transactions,
  };
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

export const addTransactionToDb = async (
  id: string,
  {
    associatedActionId,
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

  const input: CreateTransactionInput = {
    id,
    context: context as unknown as ClientType,
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
    title: JSON.stringify(title) || null,
    titleValues: JSON.stringify(titleValues) || null,
    params: txParams,
    identifier: identifier || null,
    options: JSON.stringify(options),
    associatedActionId: associatedActionId || null,
    gasLimit: null,
    gasPrice: null,
  };

  await mutateWithAuthRetry(() =>
    apollo.mutate<
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
          id,
          createdAt: txCreatedAt,
          group: {
            __typename: 'TransactionGroup',
            ...input.group,
          },
        },
      },
    }),
  );
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
        gasLimit: input?.gasLimit,
        gasPrice: input?.gasPrice,
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
        gasLimit: optimisticResponse.gasLimit || null,
        gasPrice: optimisticResponse.gasPrice || null,
        ...optimisticResponse,
      },
    };
  }

  await mutateWithAuthRetry(() =>
    apollo
      .mutate<
        UpdateTransactionMutation,
        UpdateTransactionMutationVariables
      >(mutationOpts)
      .then(() =>
        apollo.refetchQueries({ include: [GetUserTransactionsDocument] }),
      ),
  );
};

export const deleteTransaction = async (id: string) => {
  const apollo = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);

  await mutateWithAuthRetry(() =>
    apollo.mutate<
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
    }),
  );
};

// Update the transaction status to pending in the database
export const transactionSetPending = async (id: string) => {
  onTransactionPending(id);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);
  const input = {
    id,
    from: walletAddress,
    status: TransactionStatus.Pending,
  };
  return updateTransaction(input, input);
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

export const failPendingTransactions = async () => {
  const wallet = getContext(ContextModule.Wallet);
  const userAddress = utils.getAddress(wallet.address);
  const apollo = getContext(ContextModule.ApolloClient);

  return apollo.mutate<InitializeUserMutation, InitializeUserMutationVariables>(
    {
      mutation: InitializeUserDocument,
      variables: {
        input: {
          userAddress,
        },
      },
      update: (cache, { data: result }) => {
        if (result?.initializeUser) {
          result.initializeUser.failedTransactions.forEach((failedTx) => {
            cache.modify({
              id: cache.identify(result.initializeUser),
              fields: {
                status() {
                  return failedTx.status;
                },
              },
            });
          });
        }
      },
    },
  );
};
