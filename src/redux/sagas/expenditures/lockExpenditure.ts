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
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

export type LockExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_LOCK>['payload'];

function* lockExpenditureAction({
  payload: { colonyAddress, nativeExpenditureId, associatedActionId },
  meta,
}: Action<ActionTypes.EXPENDITURE_LOCK>) {
  const batchKey = TRANSACTION_METHODS.LockExpenditure;

  const { lockExpenditure }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, ['lockExpenditure']);

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
      associatedActionId,
    });

    yield takeFrom(lockExpenditure.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(lockExpenditure.id);

    yield waitForTxResult(lockExpenditure.channel);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_LOCK_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_LOCK_ERROR, error, meta);
  } finally {
    lockExpenditure.channel.close();
  }

  return null;
}

export default function* lockExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_LOCK, lockExpenditureAction);
}
