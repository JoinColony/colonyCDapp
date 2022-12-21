import { all, call, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import { getTxChannel } from '../transactions';
import {
  modifyParams,
  putError,
  refreshExtensions,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
  takeFrom,
} from '../utils';

function* extensionEnable({
  meta,
  payload,
  payload: {
    colonyAddress,
    extensionData: { extensionId, isInitialized, initializationParams },
  },
}: Action<ActionTypes.EXTENSION_ENABLE>) {
  const initChannelName = `${meta.id}-initialise`;

  yield removeOldExtensionClients(colonyAddress, extensionId);

  const initChannel = yield call(getTxChannel, initChannelName);

  try {
    if (!isInitialized && initializationParams) {
      const initParams = modifyParams(initializationParams, payload);

      const {
        channels,
        transactionChannels,
        transactionChannels: { initialise },
        createGroupTransaction,
      } = yield setupEnablingGroupTransactions(
        meta.id,
        initParams,
        extensionId,
      );

      yield all(
        Object.keys(transactionChannels).map((channelName) =>
          createGroupTransaction(transactionChannels[channelName], {
            identifier: colonyAddress,
            methodName: channelName,
            ...channels[channelName],
          }),
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

      yield takeFrom(initialise.channel, ActionTypes.TRANSACTION_SUCCEEDED);

      yield put({
        type: ActionTypes.EXTENSION_ENABLE_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_ENABLE_ERROR, error, meta);
  }

  yield call(refreshExtensions);

  initChannel.close();

  return null;
}

export default function* extensionEnableSaga() {
  yield takeEvery(ActionTypes.EXTENSION_ENABLE, extensionEnable);
}
