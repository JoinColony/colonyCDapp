import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { clearContributorsAndRolesCache } from '~utils/members.ts';
import { intArrayToBytes32 } from '~utils/web3/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  modifyParams,
  putError,
  removeOldExtensionClients,
  takeFrom,
  getColonyManager,
  initiateTransaction,
} from '../utils/index.ts';

export interface ExtensionEnableError extends Error {
  initialiseTransactionFailed?: boolean;
  setUserRolesTransactionFailed?: boolean;
}

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
  const batchKey = TRANSACTION_METHODS.EnableExtension;
  let txIndex = 0;

  yield removeOldExtensionClients(colonyAddress, extensionId);

  const needsInitialisation = !isInitialized && initializationParams;
  const needsSettingRoles = !!missingColonyPermissions.length;

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
        colonyClient.networkClient,
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
      try {
        yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_CREATED);
        yield initiateTransaction(initialise.id);
        yield waitForTxResult(initialise.channel);
      } catch (error) {
        (error as ExtensionEnableError).initialiseTransactionFailed = true;
        throw error;
      }
    }

    if (needsSettingRoles) {
      try {
        yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);
        yield initiateTransaction(setUserRoles.id);
        yield waitForTxResult(setUserRoles.channel);
      } catch (error) {
        (error as ExtensionEnableError).setUserRolesTransactionFailed = true;
        throw error;
      }
    }

    yield put({
      type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
      payload: {},
      meta,
    });

    yield clearContributorsAndRolesCache();
  } catch (error) {
    console.error(error);
    return yield putError(
      ActionTypes.EXTENSION_ENABLE_ERROR,
      error as ExtensionEnableError,
      meta,
    );
  } finally {
    [initialise, setUserRoles].map(({ channel }) => channel.close());
  }

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
