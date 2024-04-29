import { type ApolloQueryResult } from '@apollo/client';
import { type TxOverrides } from '@colony/colony-js';
import { utils } from 'ethers';
import { type Channel, buffers, channel } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  type GetTransactionQuery,
  GetTransactionsByGroupDocument,
  type GetTransactionsByGroupQuery,
  type GetTransactionsByGroupQueryVariables,
  TransactionStatus,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  type TransactionOptionsUpdatePayload,
  type TransactionActionTypes,
  type TransactionErrorPayload,
  type TransactionGasUpdatePayload,
  type TransactionHashReceivedPayload,
  type TransactionLoadRelatedPayload,
  type TransactionReceiptReceivedPayload,
  type TransactionSucceededPayload,
} from '~redux/types/actions/transaction.ts';
import { notNull } from '~utils/arrays/index.ts';

import {
  fetchTransaction,
  updateTransaction,
} from '../../../state/transactionState.ts';

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
      case ActionTypes.TRANSACTION_READY: {
        // This is handled in transactionSetReady
        break;
      }

      case ActionTypes.TRANSACTION_ADD_IDENTIFIER: {
        // This is handled in transactionAddIdentifier
        break;
      }

      case ActionTypes.TRANSACTION_ADD_PARAMS: {
        // This is handled in transactionAddParams
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

      case ActionTypes.TRANSACTION_OPTIONS_UPDATE: {
        const { options: newOpts } = payload as TransactionOptionsUpdatePayload;
        const tx = yield fetchTransaction({ id });
        let oldOpts: TxOverrides = {};
        try {
          if (typeof tx.data.getTransaction?.options == 'string') {
            oldOpts = JSON.parse(tx.data.getTransaction?.options);
          }
        } catch {
          // Do nothing
        }

        const options = JSON.stringify({
          ...oldOpts,
          ...newOpts,
        });

        yield updateTransaction({
          id,
          options,
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
  id: string,
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
        transactionUpdateActions.has(action.type) && action.meta.id === id,
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

export function* syncTransactionWithDb(id: string) {
  try {
    // Create a queue for action updates
    const actionChannel = channel(
      buffers.expanding<TransactionActionTypes>(10),
    );
    // Add actions to the queue in a separate process
    yield fork(listenForTransactionUpdates, id, actionChannel);

    // Once the tx exists, process updates to it.
    // Ensures we don't miss updates or try to update a tx that doesn't yet exist in the db.
    yield call(handleTransactionUpdates, actionChannel);

    // Cancel the process once we've finished processing updates to the transaction.
    yield cancel();
  } catch (e) {
    console.error(`Unable to sync transaction ${id} with db. Reason: `, e);
  }
}
