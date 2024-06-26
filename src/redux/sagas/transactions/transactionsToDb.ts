import { type ApolloQueryResult } from '@apollo/client';
import { utils } from 'ethers';
import { type Channel, buffers, channel } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  type ClientType,
  CreateTransactionDocument,
  type CreateTransactionMutation,
  type CreateTransactionMutationVariables,
  GetTransactionDocument,
  type GetTransactionQuery,
  type GetTransactionQueryVariables,
  GetTransactionsByGroupDocument,
  type GetTransactionsByGroupQuery,
  type GetTransactionsByGroupQueryVariables,
  TransactionStatus,
  UpdateTransactionDocument,
  type UpdateTransactionMutation,
  type UpdateTransactionMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  type CreateTransactionActionType,
  type Meta,
  type TransactionActionTypes,
  type TransactionAddIdentifierPayload,
  type TransactionAddParamsPayload,
  type TransactionCreatedPayload,
  type TransactionErrorPayload,
  type TransactionGasUpdatePayload,
  type TransactionHashReceivedPayload,
  type TransactionLoadRelatedPayload,
  type TransactionReceiptReceivedPayload,
  type TransactionSucceededPayload,
} from '~redux/types/actions/transaction.ts';
import { type ActionTypeWithPayloadAndMeta } from '~redux/types/index.ts';
import { notNull } from '~utils/arrays/index.ts';

const pendingTransactions = new Set();

const handleBeforeUnload = (e) => {
  e.preventDefault();
  e.returnValue = '';
  return e.returnValue;
};

const onTransactionPending = (id: string) => {
  pendingTransactions.add(id);
  // the first pending transaction, set up listener. I.e, we only need one
  if (pendingTransactions.size === 1) {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }
};

const onTransactionResolved = (id: string) => {
  pendingTransactions.delete(id);

  // no pending transactions, remove listener
  if (pendingTransactions.size === 0) {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
};

export function* addTransactionToDb({
  meta: { id },
  payload: {
    context,
    createdAt,
    from,
    group,
    identifier,
    methodContext,
    methodName,
    options,
    params,
    status,
    gasPrice,
    gasLimit,
    title,
    titleValues,
    metatransaction,
  },
}: ActionTypeWithPayloadAndMeta<
  ActionTypes.TRANSACTION_CREATED,
  TransactionCreatedPayload,
  Meta
>) {
  let colonyAddress = '0x';
  try {
    colonyAddress = getContext(ContextModule.CurrentColonyAddress);
  } catch {
    // If we don't have a colony address, we're creating a colony.
    // The correct address will be added to the transactions in the colony create saga
  }

  const txGroup = group
    ? {
        id: `${group.id}-${group.index}`,
        groupId: group.id.toString(),
        index: group.index,
        key: group.key,
        description: JSON.stringify(group.description),
        descriptionValues: JSON.stringify(group.descriptionValues),
        title: JSON.stringify(group.title),
        titleValues: JSON.stringify(group.titleValues),
      }
    : undefined;

  const txCreatedAt = createdAt.toISOString();
  const txParams = JSON.stringify(params);

  const apollo = getContext(ContextModule.ApolloClient);

  yield apollo.mutate<
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >({
    mutation: CreateTransactionDocument,
    variables: {
      input: {
        id,
        context: context as string as ClientType,
        createdAt: txCreatedAt,
        from,
        colonyAddress,
        groupId: group?.id?.toString(),
        group: txGroup,
        methodContext,
        methodName,
        status,
        metatransaction,
        title: JSON.stringify(title),
        titleValues: JSON.stringify(titleValues),
        gasPrice: gasPrice?.toString(),
        params: txParams,
        identifier,
        gasLimit: gasLimit?.toString(),
        options: JSON.stringify(options ?? '{}'),
      },
    },
  });

  yield put({ type: ActionTypes.TRANSACTION_SAVED_TO_DB, meta: { id } });
}

export const updateTransaction = async (
  input: UpdateTransactionMutationVariables['input'],
) => {
  const apollo = getContext(ContextModule.ApolloClient);

  await apollo.mutate<
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  >({
    mutation: UpdateTransactionDocument,
    variables: {
      input,
    },
  });
};

const fetchTransaction = async ({ id }) => {
  const apollo = getContext(ContextModule.ApolloClient);
  return apollo.query<GetTransactionQuery, GetTransactionQueryVariables>({
    query: GetTransactionDocument,
    variables: { id },
  });
};

function* updateTransactionInDb({
  type,
  meta: { id },
  payload,
}: TransactionActionTypes & { payload?: any }) {
  const apollo = getContext(ContextModule.ApolloClient);
  const wallet = getContext(ContextModule.Wallet);
  const walletAddress = utils.getAddress(wallet.address);

  try {
    switch (type) {
      case ActionTypes.TRANSACTION_ADD_IDENTIFIER: {
        const { identifier } = payload as TransactionAddIdentifierPayload;
        yield updateTransaction({ id, identifier, from: walletAddress });
        break;
      }

      case ActionTypes.TRANSACTION_ADD_PARAMS: {
        const { params } = payload as TransactionAddParamsPayload;
        const { data }: ApolloQueryResult<GetTransactionQuery> =
          yield fetchTransaction({ id });

        if (!data.getTransaction) {
          throw new Error(`Transaction with id ${id} not found in db`);
        }

        const oldParams = JSON.parse(data.getTransaction?.params ?? '[]');
        yield updateTransaction({
          id,
          params: JSON.stringify([...oldParams, ...params]),
          from: walletAddress,
        });

        break;
      }

      case ActionTypes.TRANSACTION_READY: {
        yield updateTransaction({
          id,
          status: TransactionStatus.Ready,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_PENDING: {
        onTransactionPending(id);
        yield updateTransaction({
          id,
          status: TransactionStatus.Pending,
          from: walletAddress,
        });

        break;
      }

      case ActionTypes.TRANSACTION_LOAD_RELATED: {
        const { loading } = payload as TransactionLoadRelatedPayload;
        yield updateTransaction({
          id,
          loadingRelated: loading,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_GAS_UPDATE: {
        const { gasLimit, gasPrice } = payload as TransactionGasUpdatePayload;
        yield updateTransaction({
          id,
          gasLimit: gasLimit?.toString(),
          gasPrice: gasPrice?.toString(),
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_SEND:
      case ActionTypes.TRANSACTION_RETRY: {
        yield updateTransaction({
          id,
          error: null,
          status: TransactionStatus.Ready,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_HASH_RECEIVED: {
        const { blockHash, blockNumber, hash } =
          payload as TransactionHashReceivedPayload;
        yield updateTransaction({
          id,
          blockHash,
          blockNumber,
          hash,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_SENT: {
        onTransactionPending(id);
        yield updateTransaction({
          id,
          status: TransactionStatus.Pending,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_RECEIPT_RECEIVED: {
        const { receipt } = payload as TransactionReceiptReceivedPayload;
        yield updateTransaction({
          id,
          receipt: JSON.stringify(receipt),
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_SUCCEEDED: {
        onTransactionResolved(id);
        const { eventData, deployedContractAddress } =
          payload as TransactionSucceededPayload;
        yield updateTransaction({
          id,
          status: TransactionStatus.Succeeded,
          deployedContractAddress,
          eventData: JSON.stringify(eventData ?? {}),
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_ERROR: {
        onTransactionResolved(id);
        const { error } = payload as TransactionErrorPayload;
        yield updateTransaction({
          id,
          status: TransactionStatus.Failed,
          error,
          from: walletAddress,
        });
        break;
      }

      case ActionTypes.TRANSACTION_CANCEL: {
        onTransactionResolved(id);
        const { data }: ApolloQueryResult<GetTransactionQuery> =
          yield fetchTransaction({ id });

        if (!data.getTransaction) {
          throw new Error(`Transaction with id ${id} not found in db`);
        }

        const { group: txGroup, from } = data.getTransaction ?? {};

        /*
         * If tx belongs to a group, (soft) delete this tx and all txs made after this one
         */
        if (txGroup) {
          const {
            data: response,
          }: ApolloQueryResult<GetTransactionsByGroupQuery> =
            yield apollo.query<
              GetTransactionsByGroupQuery,
              GetTransactionsByGroupQueryVariables
            >({
              query: GetTransactionsByGroupDocument,
              // group ids are unique, but check "from" is the same, just to be sure
              variables: {
                from,
                groupId: txGroup.id,
              },
            });

          yield Promise.all(
            response.getTransactionsByUserAndGroup?.items
              .filter(notNull)
              // Higher index means it comes later in the group
              .filter(({ group }) => group && group.index >= txGroup.index)
              .map(async ({ id: txId }) => {
                await updateTransaction({
                  id: txId,
                  deleted: true,
                  from: walletAddress,
                });
              }) ?? [],
          );
        } else {
          yield updateTransaction({ id, deleted: true, from: walletAddress });
        }
        break;
      }

      default: {
        break;
      }
    }
  } catch (e) {
    console.error(
      `Unable to update transaction with id: ${id} in db.
       Action type: ${type}.
       Reason: ${e}`,
    );
  }
}

function* listenForTransactionUpdates(
  createAction: CreateTransactionActionType,
  actionChannel: Channel<TransactionActionTypes>,
) {
  const transactionUpdateActions = new Set([
    ActionTypes.TRANSACTION_ADD_IDENTIFIER,
    ActionTypes.TRANSACTION_ADD_PARAMS,
    ActionTypes.TRANSACTION_RETRY,
    ActionTypes.TRANSACTION_SEND,
    ActionTypes.TRANSACTION_SENT,
    ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
    ActionTypes.TRANSACTION_SUCCEEDED,
    ActionTypes.TRANSACTION_ERROR,
    ActionTypes.TRANSACTION_CANCEL,
    ActionTypes.TRANSACTION_LOAD_RELATED,
    ActionTypes.TRANSACTION_HASH_RECEIVED,
    ActionTypes.TRANSACTION_READY,
    ActionTypes.TRANSACTION_PENDING,
    ActionTypes.TRANSACTION_GAS_UPDATE,
  ]);

  while (true) {
    const updateAction = yield take(
      (action) =>
        transactionUpdateActions.has(action.type) &&
        action.meta.id === createAction.meta.id,
    );
    yield put(actionChannel, updateAction);
    /*
     * Once we reach a terminal state, i.e. the transaction has either succeeded, failed, or been cancelled,
     * we can stop listening for updates.
     */
    if (
      updateAction.type === ActionTypes.TRANSACTION_SUCCEEDED ||
      updateAction.type === ActionTypes.TRANSACTION_ERROR ||
      updateAction.type === ActionTypes.TRANSACTION_CANCEL
    ) {
      yield cancel();
    }
  }
}

function* handleTransactionUpdates(
  actionChannel: Channel<TransactionActionTypes>,
) {
  while (true) {
    const updateAction = yield take(actionChannel);
    yield call(updateTransactionInDb, updateAction);
    /*
     * Once we reach a terminal state, i.e. the transaction has either succeeded, failed, or been cancelled,
     * we can stop processing updates.
     */
    if (
      updateAction.type === ActionTypes.TRANSACTION_SUCCEEDED ||
      updateAction.type === ActionTypes.TRANSACTION_ERROR ||
      updateAction.type === ActionTypes.TRANSACTION_CANCEL
    ) {
      actionChannel.close();
      yield cancel();
    }
  }
}

export function* syncTransactionWithDb(
  createAction: CreateTransactionActionType,
) {
  try {
    // Add tx to db in a separate process
    yield fork(addTransactionToDb, createAction);

    // Create a queue for action updates
    const actionChannel = channel(
      buffers.expanding<TransactionActionTypes>(10),
    );
    // Add actions to the queue in a separate process
    yield fork(listenForTransactionUpdates, createAction, actionChannel);

    while (true) {
      // Wait for the tx to exist in the db
      yield take(
        (action) =>
          action.type === ActionTypes.TRANSACTION_SAVED_TO_DB &&
          action.meta.id === createAction.meta.id,
      );

      // Once the tx exists, process updates to it.
      // Ensures we don't miss updates or try to update a tx that doesn't yet exist in the db.
      yield call(handleTransactionUpdates, actionChannel);

      // Cancel the process once we've finished processing updates to the transaction.
      yield cancel();
    }
  } catch (e) {
    console.error(
      `Unable to sync transaction ${createAction.meta.id} with db. Reason: `,
      e,
    );
  }
}
