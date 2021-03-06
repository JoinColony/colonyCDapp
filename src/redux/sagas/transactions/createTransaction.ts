import { Channel, buffers } from 'redux-saga';
import {
  actionChannel,
  all,
  call,
  cancel,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';

import { ActionTypes } from '../../actionTypes';
import { filterUniqueAction } from '~utils/actions';
import { getLoggedInUser } from '~data/index';
import { takeFrom } from '../utils';
import { TxConfig } from '~types/index';
import { createTxAction } from '../../actionCreators';
import estimateGasCost from './estimateGasCost';
import sendTransaction from './sendTransaction';

export function* createTransaction(id: string, config: TxConfig) {
  const { walletAddress } = yield getLoggedInUser();

  if (!walletAddress) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  if (!id) {
    throw new Error('Could not create transaction. No transaction id provided');
  }

  yield put(createTxAction(id, walletAddress, config));

  // Create tasks for estimating and sending; the actions may be taken multiple times
  const estimateGasTask = yield takeEvery(
    filterUniqueAction(id, ActionTypes.TRANSACTION_ESTIMATE_GAS),
    estimateGasCost,
  );
  const sendTask = yield takeEvery(
    filterUniqueAction(id, ActionTypes.TRANSACTION_SEND),
    sendTransaction,
  );

  // Wait for a success or cancel action before cancelling the tasks
  yield take(
    (action) =>
      (action.type === ActionTypes.TRANSACTION_SUCCEEDED ||
        action.type === ActionTypes.TRANSACTION_CANCEL) &&
      action.meta.id === id,
  );
  yield cancel([estimateGasTask, sendTask]);
}

export function* getTxChannel(id: string) {
  return yield actionChannel(filterUniqueAction(id), buffers.fixed());
}

export interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

export function* createTransactionChannels(
  batchId: string,
  ids: string[],
  customIndex = 0,
): IterableIterator<{
  [id: string]: { channel: Channel<any>; index: number; id: string };
}> {
  const txIds = ids.map((id) => `${batchId}-${id}`);
  const channels = yield all(txIds.map((id) => call(getTxChannel, id))) as any;
  return ids.reduce(
    (result, id, index) => ({
      ...result,
      [id]: {
        index: customIndex + index,
        channel: (channels as any)[index],
        id: txIds[index],
      },
    }),
    {},
  );
}

export function* waitForTxResult(channel: Channel<any>) {
  const result = yield takeFrom(channel, [
    ActionTypes.TRANSACTION_ERROR,
    ActionTypes.TRANSACTION_SUCCEEDED,
    ActionTypes.TRANSACTION_CANCEL,
  ]);

  if (result.type === ActionTypes.TRANSACTION_ERROR) {
    throw new Error('Transaction failed');
  }
}
