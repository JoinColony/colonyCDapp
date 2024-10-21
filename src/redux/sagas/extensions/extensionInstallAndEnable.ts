import {
  ClientType,
  ColonyRole,
  Id,
  getExtensionHash,
  getPermissionProofs,
} from '@colony/colony-js';
import { poll } from 'ethers/lib/utils';
import { takeEvery, fork, put } from 'redux-saga/effects';

import { type ColonyManager } from '~context';
import { type Action, ActionTypes } from '~redux/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { intArrayToBytes32 } from '~utils/web3/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  takeFrom,
  putError,
  initiateTransaction,
  removeOldExtensionClients,
  modifyParams,
  getColonyManager,
} from '../utils/index.ts';

export interface ExtensionInstallAndEnableError extends Error {
  initialiseTransactionFailed?: boolean;
  setUserRolesTransactionFailed?: boolean;
}

// Saga will attempt to
// 1. Install extension
// Then, if enabledAutomaticallyAfterInstall is true
// 2. Initialise extension if initializationParams provided
// 3. Give extension permissions
export function* extensionInstallAndEnable({
  meta,
  payload: {
    colonyAddress,
    extensionData: {
      extensionId,
      initializationParams,
      neededColonyPermissions,
      availableVersion,
      autoEnableAfterInstall,
    },
    defaultParams,
  },
}: Action<ActionTypes.EXTENSION_INSTALL_AND_ENABLE>) {
  const batchKey = TRANSACTION_METHODS.InstallAndEnableExtension;

  const {
    installExtension,
    initialise,
    setUserRoles,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['installExtension', 'initialise', 'setUserRoles'],
  );

  const needsInitialisation = initializationParams !== undefined;

  try {
    yield fork(createTransaction, installExtension.id, {
      context: ClientType.ColonyClient,
      group: {
        key: TRANSACTION_METHODS.InstallExtension,
        id: meta.id,
        index: 0,
      },
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), availableVersion],
    });

    yield takeFrom(installExtension.channel, ActionTypes.TRANSACTION_CREATED);

    // If autoEnableAfterInstall, create initialise and setUserRoles transactions
    if (autoEnableAfterInstall) {
      if (needsInitialisation) {
        yield fork(createTransaction, initialise.id, {
          context: `${extensionId}Client`,
          methodName: 'initialise',
          identifier: colonyAddress,
          ready: false,
          group: {
            key: batchKey,
            id: meta.id,
            index: 1,
          },
        });

        yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_CREATED);
      }

      yield fork(createTransaction, setUserRoles.id, {
        context: ClientType.ColonyClient,
        methodName: 'setUserRoles',
        identifier: colonyAddress,
        ready: false,
        group: {
          key: batchKey,
          id: meta.id,
          index: needsInitialisation ? 2 : 1,
        },
      });

      yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction(installExtension.id);
    yield waitForTxResult(installExtension.channel);

    // If not enabledAutomaticallyAfterInstall return success here
    if (!autoEnableAfterInstall) {
      yield put({
        type: ActionTypes.EXTENSION_INSTALL_AND_ENABLE_SUCCESS,
        payload: {},
        meta,
      });
      return null;
    }

    // Remove old extension clients after extension is installed
    yield removeOldExtensionClients(colonyAddress, extensionId);

    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * Avoid a race condition where the contract might actually not be found on chain
     * even though we have it from inside the transaction receipt
     *
     * This might happen if using different RPC endpoints which are at different block
     * heights from one another
     */
    const extensionClient = yield poll(
      async () => {
        try {
          const client = await colonyClient.getExtensionClient(extensionId);
          return client;
        } catch (err) {
          return undefined;
        }
      },
      {
        timeout: 30000,
        retryLimit: 10,
      },
    );

    if (needsInitialisation) {
      const initParams = modifyParams(initializationParams, defaultParams);
      yield transactionSetParams(initialise.id, initParams);

      try {
        yield initiateTransaction(initialise.id);
        yield waitForTxResult(initialise.channel);
      } catch (error) {
        (error as ExtensionInstallAndEnableError).initialiseTransactionFailed =
          true;
        throw error;
      }
    }

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      Id.RootDomain,
      ColonyRole.Root,
    );

    const bytes32Roles = intArrayToBytes32(neededColonyPermissions);

    const extensionAddress = extensionClient.address;

    yield transactionSetParams(setUserRoles.id, [
      permissionDomainId,
      childSkillIndex,
      extensionAddress,
      Id.RootDomain,
      bytes32Roles,
    ]);

    try {
      yield initiateTransaction(setUserRoles.id);
      yield waitForTxResult(setUserRoles.channel);
    } catch (error) {
      (error as ExtensionInstallAndEnableError).setUserRolesTransactionFailed =
        true;
      throw error;
    }

    yield put({
      type: ActionTypes.EXTENSION_INSTALL_AND_ENABLE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    console.error(error);
    return yield putError(
      ActionTypes.EXTENSION_INSTALL_AND_ENABLE_ERROR,
      error as ExtensionInstallAndEnableError,
      meta,
    );
  } finally {
    [installExtension, initialise, setUserRoles].map(({ channel }) =>
      channel.close(),
    );
  }

  return null;
}

export default function* extensionInstallAndEnableSaga() {
  yield takeEvery(
    ActionTypes.EXTENSION_INSTALL_AND_ENABLE,
    extensionInstallAndEnable,
  );
}
