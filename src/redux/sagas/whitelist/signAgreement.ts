import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Extension } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import { putError, takeFrom, refreshExtension } from '../utils';
import { createTransaction, getTxChannel } from '../transactions';

function* signAgreement({
  payload: { agreementHash, colonyAddress },
  meta,
}: Action<ActionTypes.WHITELIST_SIGN_AGREEMENT>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (!agreementHash) {
      throw new Error('Agreement hash needs to be provided');
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.WhitelistClient,
      methodName: 'signAgreement',
      params: [agreementHash],
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.WHITELIST_SIGN_AGREEMENT_SUCCESS,
      meta,
    });

    yield refreshExtension(colonyAddress, Extension.Whitelist);
  } catch (caughtError) {
    putError(ActionTypes.WHITELIST_SIGN_AGREEMENT_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* signAgreementSaga() {
  yield takeEvery(ActionTypes.WHITELIST_SIGN_AGREEMENT, signAgreement);
}
