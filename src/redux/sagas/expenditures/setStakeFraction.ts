import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

export type SetStakeFractionPayload =
  Action<ActionTypes.SET_STAKE_FRACTION>['payload'];

function* setStakeFractionAction({
  payload: { colonyAddress, stakeFraction },
  meta,
}: Action<ActionTypes.SET_STAKE_FRACTION>) {
  const batchKey = 'setStakeFraction';

  const { setStakeFraction }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, ['setStakeFraction']);

  try {
    yield fork(createTransaction, setStakeFraction.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'setStakeFraction',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [stakeFraction],
    });

    yield takeFrom(setStakeFraction.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(setStakeFraction.id);
    yield takeFrom(
      setStakeFraction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(setStakeFraction.channel);

    yield put<AllActions>({
      type: ActionTypes.SET_STAKE_FRACTION_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.SET_STAKE_FRACTION_ERROR, error, meta);
  }

  setStakeFraction.channel.close();

  return null;
}

export default function* setStakeFractionSaga() {
  yield takeEvery(ActionTypes.SET_STAKE_FRACTION, setStakeFractionAction);
}
