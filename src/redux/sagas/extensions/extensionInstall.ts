import { ClientType, getExtensionHash } from '@colony/colony-js';
import { call, takeEvery, fork, put } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  takeFrom,
  // refreshExtension,
  // getColonyManager,
  putError,
} from '../utils';
import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

export function* extensionInstall({
  meta,
  payload: {
    colonyAddress,
    extensionData: { extensionId, availableVersion },
  },
}: Action<ActionTypes.EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  // const { networkClient } = yield getColonyManager();

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), availableVersion],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_INSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_INSTALL_ERROR, error, meta);
  }

  // @TODO: Figure out extension refreshing
  // const extensionAddress = yield networkClient.getExtensionInstallation(
  //   getExtensionHash(extensionId),
  //   colonyAddress,
  // );
  // yield call(refreshExtension, colonyAddress, extensionId, extensionAddress);

  txChannel.close();

  return null;
}

export default function* extensionInstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_INSTALL, extensionInstall);
}
