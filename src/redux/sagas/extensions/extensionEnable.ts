import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';

import { intArrayToBytes32 } from '~utils/web3';

import { ActionTypes } from '../../actionTypes';
import { Action, AllActions } from '../../types/actions';
import {
  createGroupTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import {
  Channel,
  modifyParams,
  putError,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
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
      address,
    },
  },
}: Action<ActionTypes.EXTENSION_ENABLE>) {
  const initChannelName = `${meta.id}-initialise`;

  yield removeOldExtensionClients(colonyAddress, extensionId);

  const initChannel = yield call(getTxChannel, initChannelName);

  try {
    if (!isInitialized && initializationParams) {
      const initParams = modifyParams(initializationParams, payload);

      const additionalChannels: {
        setUserRolesWithProofs?: Channel;
      } = {};

      if (neededColonyPermissions.length) {
        const bytes32Roles = intArrayToBytes32(neededColonyPermissions);
        additionalChannels.setUserRolesWithProofs = {
          context: ClientType.ColonyClient,
          params: [address, Id.RootDomain, bytes32Roles],
        };
      }

      const {
        channels,
        transactionChannels,
        transactionChannels: { initialise, setUserRolesWithProofs },
      } = yield setupEnablingGroupTransactions(
        meta.id,
        initParams,
        extensionId,
        additionalChannels,
      );

      const batchKey = 'enableExtensions';

      yield all(
        Object.keys(transactionChannels).map((channelName) =>
          createGroupTransaction(
            transactionChannels[channelName],
            batchKey,
            meta,
            {
              identifier: colonyAddress,
              methodName: channelName,
              ...channels[channelName],
            },
          ),
        ),
      );

      yield all(
        Object.keys(transactionChannels).map((id) =>
          takeFrom(
            transactionChannels[id].channel,
            ActionTypes.TRANSACTION_CREATED,
          ),
        ),
      );

      const result = yield waitForTxResult(initialise.channel);

      if (setUserRolesWithProofs) {
        yield waitForTxResult(setUserRolesWithProofs.channel);
        // assume if this doesn't error, the transaction has succeeded.
        // @TODO: Handle state in which it gets cancelled
      }

      if (result.type === ActionTypes.TRANSACTION_SUCCEEDED) {
        yield put<AllActions>({
          type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
          payload: {},
          meta,
        });
      }
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_ENABLE_ERROR, error, meta);
  }

  initChannel.close();

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
