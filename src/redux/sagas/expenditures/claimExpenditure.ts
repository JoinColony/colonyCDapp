import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put, all } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { transactionPending, transactionReady } from '~redux/actionCreators';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { putError, takeFrom } from '../utils';

function* claimExpenditure({
  meta,
  payload: { colonyAddress, expenditure },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const batchKey = 'claimExpenditure';

  try {
    const channels = yield createTransactionChannels(meta.id, [
      ...expenditure.slots.map((slot) => slot.id.toString()),
    ]);

    // Create one claim transaction for each slot
    // @TODO: We should create one transaction for each token address
    yield all(
      expenditure.slots.map((slot) =>
        fork(createTransaction, channels[slot.id].id, {
          context: ClientType.ColonyClient,
          methodName: 'claimExpenditurePayout',
          identifier: colonyAddress,
          params: [
            expenditure.nativeId,
            slot.id,
            slot.payouts?.[0].tokenAddress ?? '',
          ],
          group: {
            key: batchKey,
            id: meta.id,
            index: 0,
          },
          ready: false,
        }),
      ),
    );

    yield all(
      expenditure.slots
        .map((slot) => [
          put(transactionPending(channels[slot.id].id)),
          put(transactionReady(channels[slot.id].id)),
          takeFrom(
            channels[slot.id].channel,
            ActionTypes.TRANSACTION_SUCCEEDED,
          ),
        ])
        .flat(),
    );

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CLAIM_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* claimExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CLAIM, claimExpenditure);
}
