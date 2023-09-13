import { fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';

import { intArrayToBytes32 } from '~utils/web3';
import { transactionPending, transactionReady } from '~redux/actionCreators';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import {
  modifyParams,
  putError,
  refreshEnabledExtension,
  removeOldExtensionClients,
  takeFrom,
} from '../utils';

function* extensionEnable({
  meta,
  payload,
  payload: {
    colonyAddress,
    extensionData: {
      extensionId,
      isInitialized,
      initializationParams,
      neededColonyPermissions,
      missingColonyPermissions,
      address,
    },
  },
}: Action<ActionTypes.EXTENSION_ENABLE>) {
  const batchKey = 'enableExtension';
  let txIndex = 0;

  yield removeOldExtensionClients(colonyAddress, extensionId);

  const needsInitialisation = !isInitialized && initializationParams;
  const needsSettingRoles = missingColonyPermissions.length;

  const { initialise, setUserRoles }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, ['initialise', 'setUserRoles']);

  try {
    if (needsInitialisation) {
      const initParams = modifyParams(initializationParams, payload);

      yield fork(createTransaction, initialise.id, {
        context: `${extensionId}Client`,
        methodName: 'initialise',
        identifier: colonyAddress,
        ready: false,
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        params: initParams,
      });

      txIndex += 1;
    }

    if (needsSettingRoles) {
      const bytes32Roles = intArrayToBytes32(neededColonyPermissions);

      yield fork(createTransaction, setUserRoles.id, {
        context: ClientType.ColonyClient,
        methodName: 'setUserRolesWithProofs',
        identifier: colonyAddress,
        ready: false,
        group: {
          key: batchKey,
          id: meta.id,
          index: txIndex,
        },
        params: [address, Id.RootDomain, bytes32Roles],
      });

      txIndex += 1;
    }

    if (needsInitialisation) {
      yield put(transactionPending(initialise.id));
      yield put(transactionReady(initialise.id));
      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    if (needsSettingRoles) {
      yield put(transactionPending(setUserRoles.id));
      yield put(transactionReady(setUserRoles.id));
      yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }

    yield put({
      type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_ENABLE_ERROR, error, meta);
  }

  refreshEnabledExtension(colonyAddress, extensionId);

  [initialise, setUserRoles].map((channel) => channel.channel.close());

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
