import { ClientType, getExtensionHash } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

export function* extensionUninstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.EXTENSION_UNINSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const colonyManager: ColonyManager = yield getColonyManager();

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      group: {
        key: 'uninstallExtension',
        id: meta.id,
        index: 0,
      },
      methodName: 'uninstallExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId)],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(meta.id);

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      colonyManager.removeColonyExtensionClient(colonyAddress, extensionId);
      yield put<AllActions>({
        type: ActionTypes.EXTENSION_UNINSTALL_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_UNINSTALL_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* extensionUninstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_UNINSTALL, extensionUninstall);
}
