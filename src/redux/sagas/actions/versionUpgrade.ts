import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';
import { getColonyManager, putError, takeFrom } from '../utils';

function* createVersionUpgradeAction({
  payload: { colonyAddress, colonyName, version /* annotationMessage */ },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_VERSION_UPGRADE>) {
  let txChannel;
  try {
    const colonyManager = yield getColonyManager();
    const { networkClient } = colonyManager;

    const newestVersion = yield networkClient.getCurrentColonyVersion();
    const nextVersion = BigNumber.from(version).add(1);

    if (nextVersion.lte(newestVersion)) {
      throw new Error('Colony has the newest version');
    }

    // const supportAnnotation = currentVersion >= 5 && annotationMessage;

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'upgrade';

    const { upgrade } = yield createTransactionChannels(metaId, ['upgrade']);

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

    // if (supportAnnotation) {
    //   yield fork(createTransaction, annotateUpgrade.id, {
    //     context: ClientType.ColonyClient,
    //     methodName: 'annotateTransaction',
    //     identifier: colonyAddress,
    //     params: [],
    //     group: {
    //       key: batchKey,
    //       id: metaId,
    //       index: 1,
    //     },
    //     ready: false,
    //   });
    // }

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_CREATED);

    // if (supportAnnotation) {
    //   yield takeFrom(annotateUpgrade.channel, ActionTypes.TRANSACTION_CREATED);
    // }

    yield put(transactionReady(upgrade.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // /* need to check for annotaiton message here again because there is a TS error when pushing */
    // if (annotationMessage && supportAnnotation) {
    //   yield put(transactionPending(annotateUpgrade.id));

    //   const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);

    //   yield put(transactionAddParams(annotateUpgrade.id, [txHash, ipfsHash]));

    //   yield put(transactionReady(annotateUpgrade.id));

    //   yield takeFrom(
    //     annotateUpgrade.channel,
    //     ActionTypes.TRANSACTION_SUCCEEDED,
    //   );
    // }

    yield colonyManager.setColonyClient(colonyAddress);

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      yield navigate(`/colony/${colonyName}/tx/${txHash}`);
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
