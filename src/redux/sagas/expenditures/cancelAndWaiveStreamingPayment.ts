import { ClientType } from '@colony/colony-js';
import { utils } from 'ethers';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

function* cancelAndWaiveStreamingPaymentAction({
  meta,
  payload: { colonyAddress, streamingPayment },
}: Action<ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE>) {
  const batchKey = 'cancelAndWaiveStreamingPayment';

  const { cancelAndWaiveStreamingPayment }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, [
      'cancelAndWaiveStreamingPayment',
    ]);

  try {
    const wallet = getContext(ContextModule.Wallet);
    const senderAddress = utils.getAddress(wallet.address);

    if (senderAddress !== streamingPayment.recipientAddress) {
      throw new Error('The stream recipient is not the current user');
    }

    yield fork(createTransaction, cancelAndWaiveStreamingPayment.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'cancelAndWaive',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [streamingPayment.nativeId],
    });

    yield takeFrom(
      cancelAndWaiveStreamingPayment.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield initiateTransaction({ id: cancelAndWaiveStreamingPayment.id });

    yield waitForTxResult(cancelAndWaiveStreamingPayment.channel);

    yield put<AllActions>({
      type: ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE_ERROR,
      error,
      meta,
    );
  } finally {
    cancelAndWaiveStreamingPayment.channel.close();
  }

  return null;
}

export default function* cancelAndWaiveStreamingPaymentSaga() {
  yield takeEvery(
    ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE,
    cancelAndWaiveStreamingPaymentAction,
  );
}
