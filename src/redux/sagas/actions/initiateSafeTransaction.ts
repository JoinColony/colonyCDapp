import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  type CreateSafeTransactionMutation,
  CreateSafeTransactionDocument,
  type CreateSafeTransactionMutationVariables,
  type CreateSafeTransactionDataMutation,
  CreateSafeTransactionDataDocument,
  type CreateSafeTransactionDataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { transactionSetReady } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { fill, omit } from '~utils/lodash.ts';
import { putError, takeFrom } from '~utils/saga/effects.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { createActionMetadataInDB, uploadAnnotation } from '../utils/index.ts';
import {
  getHomeBridgeByChain,
  getTransactionEncodedData,
} from '../utils/safeHelpers.ts';

function* initiateSafeTransactionAction({
  payload: {
    safe,
    transactions,
    customActionTitle: title,
    colonyAddress,
    network,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = getContext(ContextModule.ApolloClient);

    const homeBridge = yield getHomeBridgeByChain(safe.chainId);

    const transactionData: string[] = yield getTransactionEncodedData({
      transactions,
      safe,
      network,
      homeBridge,
    });

    const batchKey = TRANSACTION_METHODS.InitiateSafeTransaction;

    const { initiateSafeTransaction, annotateInitiateSafeTransaction } =
      yield createTransactionChannels(metaId, [
        'initiateSafeTransaction',
        'annotateInitiateSafeTransaction',
      ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
          titleValues: { title },
        },
      });

    yield createGroupTransaction(initiateSafeTransaction, {
      context: ClientType.ColonyClient,
      methodName: 'makeArbitraryTransactions',
      identifier: colonyAddress,
      params: [
        fill(Array(transactionData.length), homeBridge.address),
        transactionData,
        true,
      ],
      ready: false,
      titleValues: { title },
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateInitiateSafeTransaction, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(
        annotateInitiateSafeTransaction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetReady(initiateSafeTransaction.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(initiateSafeTransaction.channel);

    /**
     * Create parent safe transaction in the database
     */
    const safeTransaction = yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateSafeTransactionMutation,
        CreateSafeTransactionMutationVariables
      >({
        mutation: CreateSafeTransactionDocument,
        variables: {
          input: {
            id: txHash,
            safe,
          },
        },
      }),
    );

    /*
     * Create individual safe transaction data records
     */
    for (const transaction of transactions) {
      yield mutateWithAuthRetry(() =>
        apolloClient.mutate<
          CreateSafeTransactionDataMutation,
          CreateSafeTransactionDataMutationVariables
        >({
          mutation: CreateSafeTransactionDataDocument,
          variables: {
            input: {
              ...omit(transaction, 'token'),
              tokenAddress: transaction.token?.tokenAddress,
              transactionHash: safeTransaction.data.createSafeTransaction.id,
            },
          },
        }),
      );
    }

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateInitiateSafeTransaction,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    setTxHash?.(txHash);
  } catch (error) {
    yield putError(
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* initiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionAction,
  );
}
