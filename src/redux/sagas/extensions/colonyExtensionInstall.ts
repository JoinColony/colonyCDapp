import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  NetworkExtensionVersionQuery,
  NetworkExtensionVersionQueryVariables,
  NetworkExtensionVersionDocument,
} from '~data/index';
import { ContextModule, getContext } from '~context';
import { putError, takeFrom, refreshExtension } from '../utils';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';

export function* colonyExtensionInstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = getContext(ContextModule.ApolloClient);
  const { networkClient } = getContext(ContextModule.ColonyManager);

  try {
    /*
     * Get the latest extension version that's supported by colonyJS
     */
    const {
      data: { networkExtensionVersion },
    } = yield apolloClient.query<
      NetworkExtensionVersionQuery,
      NetworkExtensionVersionQueryVariables
    >({
      query: NetworkExtensionVersionDocument,
      variables: {
        extensionId,
      },
      fetchPolicy: 'network-only',
    });
    const [latestExtensionDepoyment] = networkExtensionVersion;

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [
        getExtensionHash(extensionId),
        latestExtensionDepoyment?.version || 0,
      ],
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
  } finally {
    const extensionAddress = yield networkClient.getExtensionInstallation(
      getExtensionHash(extensionId),
      colonyAddress,
    );
    yield call(refreshExtension, colonyAddress, extensionId, extensionAddress);

    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionInstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_INSTALL, colonyExtensionInstall);
}
