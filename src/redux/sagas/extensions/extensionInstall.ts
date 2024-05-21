import { type ApolloQueryResult } from '@apollo/client';
import {
  ClientType,
  ColonyRole,
  Extension,
  Id,
  getExtensionHash,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, takeEvery, fork, put, all } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context';
import {
  GetColonyRootRolesDocument,
  type GetColonyRootRolesQuery,
  type GetColonyRootRolesQueryVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { intArrayToBytes32 } from '~utils/web3/index.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  takeFrom,
  putError,
  initiateTransaction,
  getColonyManager,
} from '../utils/index.ts';

export function* extensionInstall({
  meta,
  payload: {
    colonyAddress,
    extensionData: { extensionId, availableVersion },
  },
}: Action<ActionTypes.EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      group: {
        key: 'installExtension',
        id: meta.id,
        index: 0,
      },
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), availableVersion],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(meta.id);

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      if (extensionId === Extension.MultisigPermissions) {
        yield handleMultiSigInstall(colonyAddress, meta.id);
      }
      yield put<AllActions>({
        type: ActionTypes.EXTENSION_INSTALL_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_INSTALL_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

function* handleMultiSigInstall(colonyAddress: string, metaId: string) {
  const batchKey = 'setInitialMultiSigRoles';

  const apolloClient = getContext(ContextModule.ApolloClient);
  const colonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const [, childSkillIndex] = yield getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    Id.RootDomain,
    ColonyRole.Architecture,
  );

  const { data }: ApolloQueryResult<GetColonyRootRolesQuery> =
    yield apolloClient.query<
      GetColonyRootRolesQuery,
      GetColonyRootRolesQueryVariables
    >({
      query: GetColonyRootRolesDocument,
      variables: { colonyAddress },
    });

  const rootRoleItems = data?.getColony?.roles?.items ?? [];

  if (rootRoleItems.length === 0) {
    return;
  }

  const rootUserIds = rootRoleItems.reduce<string[]>((userIds, rootItem) => {
    if (rootItem === null || rootItem?.targetUser?.id === undefined) {
      return userIds;
    }

    return [...userIds, rootItem.targetAddress];
  }, []);

  const getUserChannelId = (userId: string) =>
    `multisig-${colonyAddress}-${userId}`;

  const channels = yield createTransactionChannels(metaId, [
    ...rootUserIds.map((rootUserId) => getUserChannelId(rootUserId)),
  ]);

  yield all(
    rootUserIds.map((userId, index) =>
      fork(createTransaction, channels[getUserChannelId(userId)].id, {
        context: ClientType.MultisigPermissionsClient,
        methodName: 'setUserRoles',
        identifier: colonyAddress,
        params: [
          Id.RootDomain,
          childSkillIndex,
          userId,
          Id.RootDomain,
          intArrayToBytes32([1]),
        ],
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
        ready: false,
      }),
    ),
  );

  for (const userId of rootUserIds) {
    const userChannelId = getUserChannelId(userId);

    yield takeFrom(
      channels[userChannelId].channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield initiateTransaction({ id: channels[userChannelId].id });
    yield waitForTxResult(channels[userChannelId].channel);
  }
}

export default function* extensionInstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_INSTALL, extensionInstall);
}
