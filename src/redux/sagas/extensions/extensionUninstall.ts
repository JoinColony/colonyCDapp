import { ClientType, getExtensionHash } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import { putError, refreshUninstalledExtension, takeFrom } from '../utils';

export function* extensionUninstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.EXTENSION_UNINSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'uninstallExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId)],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_UNINSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_UNINSTALL_ERROR, error, meta);
  }

  refreshUninstalledExtension(colonyAddress, extensionId);

  txChannel.close();

  return null;
}

export default function* extensionUninstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_UNINSTALL, extensionUninstall);
}
