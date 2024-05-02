import {
  ClientType,
  Id,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { hexlify, hexZeroPad } from 'ethers/lib/utils';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { Authority } from '~types/authority.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { putError, takeFrom } from '~utils/saga/effects.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  uploadAnnotation,
  createActionMetadataInDB,
} from '../utils/index.ts';

function* managePermissionsMotion({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    authority,
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
    const multiSigClient = yield colonyManager.getClient(
      ClientType.MultisigPermissionsClient,
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
    const batchKey = TRANSACTION_METHODS.CreateMotion;

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

    const altTargetMap = {
      [Authority.Own]: ADDRESS_ZERO,
      [Authority.ViaMultiSig]: multiSigClient.address,
    };

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        altTargetMap[authority],
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

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateSetUserRolesMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    yield putError(ActionTypes.MOTION_USER_ROLES_SET_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* managePermissionsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_USER_ROLES_SET, managePermissionsMotion);
}
