import { type ClientType } from '@colony/colony-js';
import { type Channel, buffers } from 'redux-saga';
import {
  actionChannel,
  all,
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';

import { getContext, ContextModule } from '~context/index.ts';
import { TransactionStatus } from '~gql';
import { createTransactionAction } from '~redux/actionCreators/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { addTransactionToDb } from '~state/transactionState.ts';
import { type ExtendedClientType, type TxConfig } from '~types/transactions.ts';
import { filterUniqueAction } from '~utils/actions.ts';

import { takeFrom, metatransactionsEnabled } from '../utils/index.ts';

import estimateGasCost from './estimateGasCost.ts';
import sendTransaction from './sendTransaction.ts';

export function* createTransaction(id: string, config: TxConfig) {
  const { address: walletAddress } = getContext(ContextModule.Wallet);
  const shouldSendMetatransaction = yield metatransactionsEnabled();

  if (!walletAddress) {
    throw new Error(
      'Could not create transaction. No current user address available',
    );
  }

  if (!id) {
    throw new Error('Could not create transaction. No transaction id provided');
  }

  yield addTransactionToDb(id, {
    associatedActionId: config.associatedActionId,
    context: config.context as ClientType | ExtendedClientType,
    createdAt: new Date(),
    from: walletAddress,
    group: config.group,
    identifier: config.identifier,
    methodContext: config.methodContext,
    methodName: config.methodName,
    options: config.options,
    params: config.params,
    status:
      config.ready === false
        ? TransactionStatus.Created
        : TransactionStatus.Ready,
    title: config.title,
    titleValues: config.titleValues,
  });

  if (shouldSendMetatransaction) {
    yield put(
      createTransactionAction(id, walletAddress, {
        ...config,
      }),
    );
  } else {
    yield put(createTransactionAction(id, walletAddress, config));
  }

  // Create tasks for estimating and sending; the actions may be taken multiple times
  let estimateGasTask;
  if (!shouldSendMetatransaction) {
    estimateGasTask = yield takeEvery(
      filterUniqueAction(id, ActionTypes.TRANSACTION_ESTIMATE_GAS),
      estimateGasCost,
    );
  }

  const sendTransactionTask = yield takeEvery(
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

  const tasks = [sendTransactionTask];
  if (estimateGasTask) {
    tasks.push(estimateGasTask);
  }

  yield cancel(tasks);
}

export function* getTxChannel(id: string) {
  return yield actionChannel(filterUniqueAction(id), buffers.expanding());
}

export interface ChannelDefinition {
  channel: Channel<any>;
  index: number;
  id: string;
}

export type TransactionChannel = {
  channel: Channel<any>;
  index: number;
  id: string;
};

export type TransactionChannelMap = Record<string, TransactionChannel>;

export function* createTransactionChannels(
  batchId: string,
  ids: string[],
  customIndex = 0,
): IterableIterator<TransactionChannelMap> {
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

  switch (result.type) {
    case ActionTypes.TRANSACTION_ERROR:
      throw new Error('Transaction failed');
    case ActionTypes.TRANSACTION_CANCEL:
      throw new Error('Transaction cancelled');
    default:
      return result;
  }
}

export const createGroupTransaction = ({
  channel: { id, index },
  batchKey,
  meta,
  config,
}: {
  channel: { id: string; index: number };
  batchKey: string;
  meta: { id: string };
  config: Omit<TxConfig, 'group'> & { group?: Partial<TxConfig['group']> };
}) =>
  fork(createTransaction, id, {
    ...config,
    group: {
      ...config.group,
      key: batchKey,
      id: meta.id,
      index,
    },
  });
