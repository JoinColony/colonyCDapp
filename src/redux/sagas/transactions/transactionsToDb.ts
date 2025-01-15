import { type ApolloQueryResult } from '@apollo/client';
import { type TxOverrides } from '@colony/colony-js';
import { utils } from 'ethers';
import { takeEvery, put } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
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
import {
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from '~state/transactionState.ts';
import { notNull } from '~utils/arrays/index.ts';

const pendingTransactions = new Set();

const handleBeforeUnload = (e) => {
  e.preventDefault();
  e.returnValue = '';
  return e.returnValue;
};

export const onTransactionPending = (id: string) => {
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

  try {
    switch (type) {
      case ActionTypes.TRANSACTION_LOAD_RELATED: {
        const { loading } = payload as TransactionLoadRelatedPayload;
        yield updateTransaction({
          id,
          loadingRelated: loading,
        });
        break;
      }

      case ActionTypes.TRANSACTION_GAS_UPDATE: {
        const { gasLimit, gasPrice } = payload as TransactionGasUpdatePayload;
        yield updateTransaction({
          id,
          gasLimit: gasLimit?.toString(),
          gasPrice: gasPrice?.toString(),
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
        });
        break;
      }

      case ActionTypes.TRANSACTION_OPTIONS_UPDATE: {
        const { options: newOpts } = payload as TransactionOptionsUpdatePayload;
        const tx = yield getTransaction(id);
        let oldOpts: TxOverrides = {};
        try {
          if (tx.options) {
            oldOpts = tx.options;
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
        });
        break;
      }

      case ActionTypes.TRANSACTION_SENT: {
        onTransactionPending(id);
        yield updateTransaction({
          id,
          status: TransactionStatus.Pending,
        });
        break;
      }

      case ActionTypes.TRANSACTION_RECEIPT_RECEIVED: {
        const { receipt } = payload as TransactionReceiptReceivedPayload;
        yield updateTransaction({
          id,
          receipt: JSON.stringify(receipt),
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
        });
        break;
      }

      case ActionTypes.TRANSACTION_ERROR: {
        onTransactionResolved(id);
        const { error } = payload as TransactionErrorPayload;
        yield updateTransaction({
          error,
          id,
          status: TransactionStatus.Failed,
        });
        break;
      }

      case ActionTypes.TRANSACTION_CANCEL: {
        onTransactionResolved(id);
        const tx = yield getTransaction(id);

        const { groupId, from } = tx;

        const {
          data: response,
        }: ApolloQueryResult<GetTransactionsByGroupQuery> = yield apollo.query<
          GetTransactionsByGroupQuery,
          GetTransactionsByGroupQueryVariables
        >({
          query: GetTransactionsByGroupDocument,
          // group ids are unique, but check "from" is the same, just to be sure
          variables: {
            userAddress: utils.getAddress(from),
            groupId,
          },
        });

        yield Promise.all(
          response.getTransactionsByUserAndGroup?.items
            .filter(notNull)
            .map(async ({ id: txId }) => {
              await deleteTransaction(txId);
            }) ?? [],
        );
        break;
      }

      default: {
        break;
      }
    }
    // Emit a success action after updating the transaction in the db, so that other
    // sagas can listen to it, in case they need to do something that requires the
    // transaction to be updated in the db first
    yield put({ type: ActionTypes.TRANSACTION_UPDATED_IN_DB, meta: { id } });
  } catch (e) {
    console.error(
      `Unable to update transaction with id: ${id} in db.
       Action type: ${type}.
       Reason: ${e}`,
    );
  }
}

export default function* setupTransactionsSaga() {
  yield takeEvery(
    [
      // TRANSACTION_READY, TRANSACTION_PENDING, TRANSACTION_ADD_IDENTIFIER, TRANSACTION_ADD_PARAMS are handled separately
      ActionTypes.TRANSACTION_SEND,
      ActionTypes.TRANSACTION_SENT,
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
      ActionTypes.TRANSACTION_SUCCEEDED,
      ActionTypes.TRANSACTION_ERROR,
      ActionTypes.TRANSACTION_CANCEL,
      ActionTypes.TRANSACTION_LOAD_RELATED,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      ActionTypes.TRANSACTION_GAS_UPDATE,
      ActionTypes.TRANSACTION_OPTIONS_UPDATE,
    ],
    updateTransactionInDb,
  );
}
