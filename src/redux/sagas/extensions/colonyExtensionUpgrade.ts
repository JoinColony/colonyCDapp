import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { ClientType, getExtensionHash } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

import { refreshExtension } from '../utils';

function* colonyExtensionUpgrade({
  meta,
  payload: { colonyAddress, extensionId, version },
}: Action<ActionTypes.COLONY_EXTENSION_UPGRADE>) {
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
      type: ActionTypes.COLONY_EXTENSION_UPGRADE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_UPGRADE_ERROR,
      error,
      meta,
    );
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionUpgradeSaga() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_UPGRADE, colonyExtensionUpgrade);
}
