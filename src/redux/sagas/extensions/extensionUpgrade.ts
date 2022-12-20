import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { ClientType, getExtensionHash } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom, refreshExtensions } from '../utils';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

function* extensionUpgrade({
  meta,
  payload: { colonyAddress, extensionId, version },
}: Action<ActionTypes.EXTENSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'upgradeExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), version],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_UPGRADE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_UPGRADE_ERROR, error, meta);
  }

  yield call(refreshExtensions);

  txChannel.close();

  return null;
}

export default function* extensionUpgradeSaga() {
  yield takeEvery(ActionTypes.EXTENSION_UPGRADE, extensionUpgrade);
}
