import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  Id,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { hexlify, hexZeroPad } from 'ethers/lib/utils';

import { ADDRESS_ZERO } from '~constants';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  getColonyManager,
  initiateTransaction,
  uploadAnnotation,
  createActionMetadataInDB,
} from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';

function* managePermissionsMotion({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    colonyName,
    annotationMessage,
    motionDomainId,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      domainId === Id.RootDomain ? ColonyRole.Root : ColonyRole.Architecture,
      votingReputationClient.address,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      domainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      ADDRESS_ZERO,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const { createMotion, annotateSetUserRolesMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateSetUserRolesMotion',
      ]);

    const roleArray = Object.values(roles).reverse();
    roleArray.splice(2, 0, false);

    let roleBitmask = '';

    roleArray.forEach((role) => {
      roleBitmask += role ? '1' : '0';
    });

    const hexString = hexlify(parseInt(roleBitmask, 2));
    const zeroPadHexString = hexZeroPad(hexString, 32);

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'setUserRoles',
      [
        permissionDomainId,
        childSkillIndex,
        userAddress,
        domainId,
        zeroPadHexString,
      ],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        ADDRESS_ZERO,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateSetUserRolesMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateSetUserRolesMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateSetUserRolesMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_USER_ROLES_SET_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* managePermissionsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_USER_ROLES_SET, managePermissionsMotion);
}
