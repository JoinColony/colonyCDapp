import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* createVersionUpgradeAction({
  payload: { colonyAddress, version, annotationMessage, customActionTitle },
  meta: { id: metaId, setTxHash },
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

    const batchKey = TRANSACTION_METHODS.Upgrade;

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

    yield initiateTransaction(upgrade.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(upgrade.channel);

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (supportAnnotation) {
      yield uploadAnnotation({
        txChannel: annotateUpgrade,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield colonyManager.setColonyClient(colonyAddress);

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(ActionTypes.ACTION_VERSION_UPGRADE_ERROR, caughtError, meta);
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
