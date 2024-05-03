import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* cancelStreamingPaymentAction({
  meta,
  payload: { colonyAddress, streamingPayment, annotationMessage },
}: Action<ActionTypes.STREAMING_PAYMENT_CANCEL>) {
  const batchKey = 'cancelStreamingPayment';

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const {
    cancelStreamingPayment,
    annotateCancelStreamingPayment,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['cancelStreamingPayment', 'annotateCancelStreamingPayment'],
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      ColonyRole.Administration,
    );

    yield fork(createTransaction, cancelStreamingPayment.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'cancel',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [permissionDomainId, childSkillIndex, streamingPayment.nativeId],
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateCancelStreamingPayment.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(
      cancelStreamingPayment.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateCancelStreamingPayment.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(cancelStreamingPayment.id);

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      cancelStreamingPayment.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(cancelStreamingPayment.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateCancelStreamingPayment,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.STREAMING_PAYMENT_CANCEL_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_CANCEL_ERROR,
      error,
      meta,
    );
  }

  [cancelStreamingPayment, annotateCancelStreamingPayment].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* cancelStreamingPaymentSaga() {
  yield takeEvery(
    ActionTypes.STREAMING_PAYMENT_CANCEL,
    cancelStreamingPaymentAction,
  );
}
