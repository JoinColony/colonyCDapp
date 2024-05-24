import { type ApolloQueryResult } from '@apollo/client';
import { type TxOverrides } from '@colony/colony-js';
import { utils } from 'ethers';
import { takeEvery } from 'redux-saga/effects';

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
          error,
          from: walletAddress,
          id,
          status: TransactionStatus.Failed,
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

export default function* setupTransactionsSaga() {
  yield takeEvery(
    [
      // TRANSACTION_READY, TRANSACTION_ADD_IDENTIFIER, TRANSACTION_ADD_PARAMS are handled separately
      ActionTypes.TRANSACTION_SEND,
      ActionTypes.TRANSACTION_SENT,
      ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
      ActionTypes.TRANSACTION_SUCCEEDED,
      ActionTypes.TRANSACTION_ERROR,
      ActionTypes.TRANSACTION_CANCEL,
      ActionTypes.TRANSACTION_LOAD_RELATED,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      ActionTypes.TRANSACTION_PENDING,
      ActionTypes.TRANSACTION_GAS_UPDATE,
    ],
    updateTransactionInDb,
  );
}
