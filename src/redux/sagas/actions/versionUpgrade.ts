import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';

function* createVersionUpgradeAction({
  payload: {
    colonyAddress,
    colonyName,
    version,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_VERSION_UPGRADE>) {
  let txChannel;
  try {
    const colonyManager = yield getColonyManager();
    const { networkClient } = colonyManager;

    const newestVersion = yield networkClient.getCurrentColonyVersion();
    const nextVersion = BigNumber.from(version).add(1);

    if (nextVersion.gt(newestVersion)) {
      throw new Error('Colony has the newest version');
    }

    const supportAnnotation = Number(version) >= 5 && annotationMessage;

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'upgrade';

    const { upgrade, annotateUpgrade } = yield createTransactionChannels(
      metaId,
      ['upgrade', 'annotateUpgrade'],
    );

    yield fork(createTransaction, upgrade.id, {
      context: ClientType.ColonyClient,
      methodName: 'upgrade',
      identifier: colonyAddress,
      params: [nextVersion],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (supportAnnotation) {
      yield fork(createTransaction, annotateUpgrade.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_CREATED);

    if (supportAnnotation) {
      yield takeFrom(annotateUpgrade.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction({ id: upgrade.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    setTxHash?.(txHash);

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (supportAnnotation) {
      yield uploadAnnotation({
        txChannel: annotateUpgrade,
        message: annotationMessage,
        txHash,
      });
    }

    yield colonyManager.setColonyClient(colonyAddress);

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.ACTION_VERSION_UPGRADE_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* versionUpgradeActionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_VERSION_UPGRADE,
    createVersionUpgradeAction,
  );
}
