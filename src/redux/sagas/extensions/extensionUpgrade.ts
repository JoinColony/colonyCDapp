import { ClientType, getExtensionHash } from '@colony/colony-js';
import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { type AllActions, type Action, ActionTypes } from '~redux/index.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

function* extensionUpgrade({
  meta,
  payload: { colonyAddress, extensionId, version },
}: Action<ActionTypes.EXTENSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      group: {
        key: 'upgradeExtension',
        id: meta.id,
        index: 0,
      },
      methodName: 'upgradeExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), version],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXTENSION_UPGRADE_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_UPGRADE_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* extensionUpgradeSaga() {
  yield takeEvery(ActionTypes.EXTENSION_UPGRADE, extensionUpgrade);
}
