import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  getNetworkContracts,
} from '~data/index';
import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  putError,
  takeFrom,
  routeRedirect,
  uploadIfpsAnnotation,
  getColonyManager,
} from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../actionCreators';

function* createVersionUpgradeAction({
  payload: { colonyAddress, colonyName, version, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_VERSION_UPGRADE>) {
  let txChannel;
  try {
    const apolloClient = getContext(ContextModule.ApolloClient);
    const colonyManager = yield getColonyManager();

    const { version: newestVersion } = yield getNetworkContracts();
    const currentVersion = parseInt(version, 10);
    const nextVersion = currentVersion + 1;
    if (nextVersion > parseInt(newestVersion, 10)) {
      throw new Error('Colony has the newest version');
    }

    const supportAnnotation = currentVersion >= 5 && annotationMessage;

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

    yield put(transactionReady(upgrade.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /* need to check for annotaiton message here again because there is a TS error when pushing */
    if (annotationMessage && supportAnnotation) {
      yield put(transactionPending(annotateUpgrade.id));

      const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);

      yield put(transactionAddParams(annotateUpgrade.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateUpgrade.id));

      yield takeFrom(
        annotateUpgrade.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield apolloClient.query<
      ProcessedColonyQuery,
      ProcessedColonyQueryVariables
    >({
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield colonyManager.setColonyClient(colonyAddress);

    yield put<AllActions>({
      type: ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
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
