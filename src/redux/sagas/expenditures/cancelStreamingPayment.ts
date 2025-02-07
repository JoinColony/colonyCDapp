import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { utils } from 'ethers';
import { fork, put, takeEvery } from 'redux-saga/effects';

import {
  ContextModule,
  getContext,
  type ColonyManager,
} from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { getStreamingPaymentCreatingActionId } from '~utils/streamingPayments.ts';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
  type TransactionChannelMap,
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
  payload: { colonyAddress, streamingPayment, annotationMessage, shouldWaive },
}: Action<ActionTypes.STREAMING_PAYMENT_CANCEL>) {
  // To make the flow more readable
  const isCancelMethod = !shouldWaive;
  const isCancelAndWaiveMethod = shouldWaive;

  const batchKey = 'cancelStreamingPayment';

  const colonyManager: ColonyManager = yield getColonyManager();

  const {
    cancelStreamingPayment,
    annotateCancelStreamingPayment,
  }: TransactionChannelMap = yield createTransactionChannels(meta.id, [
    'cancelStreamingPayment',
    'annotateCancelStreamingPayment',
  ]);

  const shouldAnnotate = isCancelMethod && annotationMessage;

  try {
    if (isCancelMethod && !colonyAddress) {
      throw new Error('The colony address should be provided');
    }

    const wallet = getContext(ContextModule.Wallet);
    const senderAddress = utils.getAddress(wallet.address);

    if (
      isCancelAndWaiveMethod &&
      senderAddress !== streamingPayment.recipientAddress
    ) {
      throw new Error(
        'The stream recipient address should be the same as the current user address',
      );
    }

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      ColonyRole.Administration,
    );

    yield fork(createTransaction, cancelStreamingPayment.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: isCancelMethod ? 'cancel' : 'cancelAndWaive',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: isCancelMethod
        ? [permissionDomainId, childSkillIndex, streamingPayment.nativeId]
        : [streamingPayment.nativeId],
      associatedActionId: getStreamingPaymentCreatingActionId(streamingPayment),
    });

    yield takeFrom(
      cancelStreamingPayment.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (shouldAnnotate) {
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
        associatedActionId:
          getStreamingPaymentCreatingActionId(streamingPayment),
      });

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

    if (shouldAnnotate) {
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
