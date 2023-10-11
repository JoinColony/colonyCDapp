import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';
import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';

import {
  putError,
  getSetExpenditureValuesFunctionParams,
  initiateTransaction,
  getResolvedExpenditurePayouts,
} from '../utils';
import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function* editExpenditure({
  payload: { colonyAddress, expenditure, payouts },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const resolvedPayouts: ExpenditurePayoutFieldValue[] =
    getResolvedExpenditurePayouts(expenditure, payouts);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureValues',
      identifier: colonyAddress,
      params: getSetExpenditureValuesFunctionParams(
        expenditure.nativeId,
        resolvedPayouts,
      ),
    });

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditure);
}
