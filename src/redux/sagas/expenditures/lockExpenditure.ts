import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  uploadAnnotation,
} from '../utils/index.ts';

export type LockExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_LOCK>['payload'];

function* lockExpenditureAction({
  payload: { colonyAddress, nativeExpenditureId, annotationMessage },
  meta,
}: Action<ActionTypes.EXPENDITURE_LOCK>) {
  const batchKey = TRANSACTION_METHODS.LockExpenditure;

  const {
    lockExpenditure,
    annotateLockExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['lockExpenditure', 'annotateLockExpenditure'],
  );

  try {
    yield fork(createTransaction, lockExpenditure.id, {
      context: ClientType.ColonyClient,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      methodName: 'lockExpenditure',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
    });
    if (annotationMessage) {
      yield fork(createTransaction, annotateLockExpenditure.id, {
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

    yield initiateTransaction({ id: lockExpenditure.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(lockExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateLockExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_LOCK_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_LOCK_ERROR, error, meta);
  }
  [lockExpenditure, annotateLockExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* lockExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_LOCK, lockExpenditureAction);
}
