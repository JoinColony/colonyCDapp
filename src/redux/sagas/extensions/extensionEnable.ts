import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';

import { isDev } from '~constants';
import { intArrayToBytes32 } from '~utils/web3';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import { createGroupTransaction, getTxChannel } from '../transactions';
import {
  Channel,
  modifyParams,
  putError,
  refreshEnabledExtension,
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

      const effects = Object.keys(transactionChannels).map((channelName) =>
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
      );

      /* Delay action creation in development, else block ingestor doesn't detect all on-chain events */
      if (isDev) {
        for (const effect of effects) {
          yield effect;
          yield new Promise((res) => {
            setTimeout(res, 3_000);
          });
        }
      } else {
        yield all(effects);
      }

      yield all(
        Object.keys(transactionChannels).map((id) =>
          takeFrom(
            transactionChannels[id].channel,
            ActionTypes.TRANSACTION_CREATED,
          ),
        ),
      );

      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      if (setUserRolesWithProofs) {
        yield takeFrom(
          setUserRolesWithProofs.channel,
          ActionTypes.TRANSACTION_SUCCEEDED,
        );
      }

      yield put({
        type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_ENABLE_ERROR, error, meta);
  }

  refreshEnabledExtension(colonyAddress, extensionId);

  initChannel.close();

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
