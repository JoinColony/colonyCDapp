import { fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';

import { ColonyManager } from '~context';
import { intArrayToBytes32 } from '~utils/web3';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions';
import {
  modifyParams,
  putError,
  removeOldExtensionClients,
  takeFrom,
  getColonyManager,
  initiateTransaction,
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
    const colonyManager: ColonyManager = yield getColonyManager();

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
      const colonyClient = yield colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient,
        Id.RootDomain,
        ColonyRole.Root,
      );

      const bytes32Roles = intArrayToBytes32(neededColonyPermissions);

      yield fork(createTransaction, setUserRoles.id, {
        context: ClientType.ColonyClient,
        methodName: 'setUserRoles',
        identifier: colonyAddress,
        ready: false,
        group: {
          key: batchKey,
          id: meta.id,
          index: txIndex,
        },
        params: [
          permissionDomainId,
          childSkillIndex,
          address,
          Id.RootDomain,
          bytes32Roles,
        ],
      });

      txIndex += 1;
    }

    if (needsInitialisation) {
      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_CREATED);
      yield initiateTransaction({ id: initialise.id });
      yield waitForTxResult(initialise.channel);
    }

    if (needsSettingRoles) {
      yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);
      yield initiateTransaction({ id: setUserRoles.id });
      yield waitForTxResult(setUserRoles.channel);
    }

    yield put({
      type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    console.error(error);
    return yield putError(ActionTypes.EXTENSION_ENABLE_ERROR, error, meta);
  } finally {
    [initialise, setUserRoles].map(({ channel }) => channel.close());
  }

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
