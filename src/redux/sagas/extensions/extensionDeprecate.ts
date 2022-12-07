import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, refreshExtensions } from '../utils';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function* extensionDeprecate({
  meta,
  payload: { colonyAddress, extensionId, isToDeprecate },
}: Action<ActionTypes.EXTENSION_DEPRECATE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'deprecateExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), isToDeprecate],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_DEPRECATE_ERROR, error, meta);
  }

  yield call(refreshExtensions);

  txChannel.close();

  return null;
}

export default function* extensionDeprecateSaga() {
  yield takeEvery(ActionTypes.EXTENSION_DEPRECATE, extensionDeprecate);
}
