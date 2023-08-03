import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import { createTransaction, getTxChannel } from '../transactions';
import { putError, takeFrom } from '../utils';

function* fundExpenditure({
  payload: {
    colonyAddress,
    fromDomainFundingPotId,
    expenditureFundingPotId,
    amount,
    tokenAddress,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_FUND>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName:
        'moveFundsBetweenPotsWithProofs(uint256,uint256,uint256,address)',
      identifier: colonyAddress,
      params: [
        fromDomainFundingPotId,
        expenditureFundingPotId,
        amount,
        tokenAddress,
      ],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FUND_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FUND_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* fundExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FUND, fundExpenditure);
}
