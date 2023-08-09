import { fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';

import { putError, takeFrom } from '../utils';
import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';

function* editExpenditure({
  payload: { colonyAddress, expenditure, slots },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const batchKey = 'editExpenditure';

  const { setRecipients }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, ['setRecipients']);

  try {
    yield fork(createTransaction, setRecipients.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureRecipients',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
      },
      ready: false,
    });

    yield put(transactionPending(setRecipients.id));
    yield put(
      transactionAddParams(setRecipients.id, [
        expenditure.nativeId,
        slots.map((_, index) => index + 1),
        slots.map((slot) => slot.recipientAddress),
      ]),
    );
    yield put(transactionReady(setRecipients.id));

    yield takeFrom(setRecipients.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  setRecipients.channel.close();

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditure);
}
