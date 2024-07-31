import { type ActionPattern } from '@redux-saga/types';
import { type Channel } from 'redux-saga';
import { all, call, cancel, fork, put, race, take } from 'redux-saga/effects';

import {
  transactionEstimateGas,
  transactionSend,
  messageSign,
} from '~redux/actionCreators/index.ts';
import { transactionSetReady } from '~state/transactionState.ts';

import {
  type ErrorActionType,
  type TakeFilter,
  type Action,
} from '../../types/actions/index.ts';

import { metatransactionsEnabled } from './getCanUserSendMetatransactions.ts';

/*
 * Effect to take a specific action from a channel.
 */
export const takeFrom = (channel: Channel<any>, type: string | string[]) =>
  call(function* takeFromSaga() {
    while (true) {
      const action = yield take(channel);
      if (
        (Array.isArray(type) && type.includes(action.type)) ||
        action.type === type
      ) {
        return action;
      }
    }
  });

/*
 * Effect to create a new class instance of Class (use instead of "new Class")
 */
export const create = <C>(Class: C, ...args: any[]) =>
  // @ts-ignore
  call(() => new Class(...args));

/*
 * Effect to put a consistent error action
 */
export const putError = (type: string, error: Error, meta: object = {}) => {
  const action: ErrorActionType<typeof type, typeof meta> = {
    type,
    meta,
    error: true,
    payload: error,
  };
  console.error(error);
  return put(action);
};

/*
 * Races the `take` of two actions, one success and one error. If success is
 * first, function returns. If error is first, function throws.
 */
export const raceError = (
  successAction: string | TakeFilter,
  errorAction: string | TakeFilter,
  error?: Error,
) => {
  function* raceErrorGenerator() {
    const result = yield race([take(successAction), take(errorAction)]) as any;
    if (result.type === errorAction) throw error || new Error(result.payload);
    return result;
  }
  return call(raceErrorGenerator);
};

export const takeLatestCancellable = (
  actionOrPattern: ActionPattern,
  cancelActionOrPattern: ActionPattern,
  saga: (action: Action<any>) => Generator<any>,
) => {
  let currentTask;

  return all([
    fork(function* takeLatest() {
      while (true) {
        const action = yield take(actionOrPattern);
        if (currentTask) {
          yield cancel(currentTask); // cancel is no-op if the task has already terminated
        }
        currentTask = yield fork(saga, action);
      }
    }),
    fork(function* cancelCurrent() {
      while (true) {
        yield take(cancelActionOrPattern);
        if (currentTask) {
          yield cancel(currentTask);
        }
      }
    }),
  ]);
};

export function* initiateTransaction(id: string) {
  const shouldSendMetatransaction = yield metatransactionsEnabled();

  yield transactionSetReady(id);

  if (shouldSendMetatransaction) {
    yield put(transactionSend(id));
  } else {
    yield put(transactionEstimateGas(id));
  }
}

export function* initiateMessageSigning(id: string) {
  yield put(messageSign(id));
}
