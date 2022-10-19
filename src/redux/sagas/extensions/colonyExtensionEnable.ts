import { all, call, takeEvery } from 'redux-saga/effects';
import { ClientType, Id } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { Action } from '../../types/actions';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import extensionData from '~data/staticData/extensionData';
import { ContextModule, getContext } from '~context';
import { intArrayToBytes32 } from '~utils/web3';

import { getTxChannel } from '../transactions';

import {
  refreshExtension,
  modifyParams,
  removeOldExtensionClients,
  setupEnablingGroupTransactions,
  Channel,
  putError,
  takeFrom,
} from '../utils';

function* colonyExtensionEnable({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COLONY_EXTENSION_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;

  yield removeOldExtensionClients(colonyAddress, extensionId);

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  const initChannel = yield call(getTxChannel, initChannelName);

  const apolloClient = getContext(ContextModule.ApolloClient);

  try {
    const { data } = yield apolloClient.query<
      ColonyExtensionQuery,
      ColonyExtensionQueryVariables
    >({
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
    });

    if (!data) {
      throw new Error('Extension not installed');
    }

    const { address, details } = data.colonyExtension;

    if (!details?.initialized && extension.initializationParams) {
      const initParams = modifyParams(extension.initializationParams, payload);

      const additionalChannels: {
        setUserRolesWithProofs?: Channel;
      } = {};
      if (details?.missingPermissions.length) {
        const bytes32Roles = intArrayToBytes32(details.missingPermissions);
        additionalChannels.setUserRolesWithProofs = {
          context: ClientType.ColonyClient,
          params: [address, Id.RootDomain, bytes32Roles],
        };
      }

      const {
        channels,
        transactionChannels,
        transactionChannels: { initialise, setUserRolesWithProofs },
        createGroupTransaction,
      } = yield setupEnablingGroupTransactions(
        metaId,
        initParams,
        extensionId,
        additionalChannels,
      );

      yield all(
        Object.keys(channels).map((channelName) =>
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

      if (setUserRolesWithProofs) {
        yield takeFrom(
          setUserRolesWithProofs.channel,
          ActionTypes.TRANSACTION_SUCCEEDED,
        );
      }
    }
    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_ENABLE_ERROR,
      error,
      meta,
    );
  } finally {
    initChannel.close();
  }
  return null;
}

export default function* colonyExtensionEnableSaga() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_ENABLE, colonyExtensionEnable);
}
