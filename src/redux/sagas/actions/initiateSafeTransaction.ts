import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import {
  CreateSafeTransactionMutation,
  CreateSafeTransactionDocument,
  CreateSafeTransactionMutationVariables,
  CreateSafeTransactionDataMutation,
  CreateSafeTransactionDataDocument,
  CreateSafeTransactionDataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { fill, omit } from '~utils/lodash';
import { putError, takeFrom } from '~utils/saga/effects';

import { transactionReady } from '../../actionCreators';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { createActionMetadataInDB, uploadAnnotation } from '../utils';
import {
  getHomeBridgeByChain,
  getTransactionEncodedData,
} from '../utils/safeHelpers';

function* initiateSafeTransactionAction({
  payload: {
    safe,
    transactions,
    customActionTitle: title,
    colonyAddress,
    colonyName,
    network,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = getContext(ContextModule.ApolloClient);

    const homeBridge = getHomeBridgeByChain(safe.chainId);

    const transactionData: string[] = yield getTransactionEncodedData(
      transactions,
      safe,
      network,
      homeBridge,
    );

    const batchKey = 'initiateSafeTransaction';

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

    yield put(transactionReady(initiateSafeTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      initiateSafeTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /**
     * Create parent safe transaction in the database
     */
    const safeTransaction = yield apolloClient.mutate<
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
    });

    /*
     * Create individual safe transaction data records
     */
    for (const transaction of transactions) {
      yield apolloClient.mutate<
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
      });
    }

    yield createActionMetadataInDB(txHash, customActionTitle);

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

    yield navigate?.(`/${colonyName}?tx=${txHash}`, {
      state: {
        isRedirect: true,
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* initiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionAction,
  );
}
