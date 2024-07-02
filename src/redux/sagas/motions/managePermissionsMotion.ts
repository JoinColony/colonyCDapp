import {
  ClientType,
  Id,
  getChildIndex,
  type ColonyRole,
} from '@colony/colony-js';
import { hexlify, hexZeroPad } from 'ethers/lib/utils';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { type ColonyRoleFragment } from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { Authority } from '~types/authority.ts';
import { type Domain } from '~types/graphql.ts';
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
  getPermissionProofsLocal,
} from '../utils/index.ts';

function* getCreateMotionParams({
  roles,
  authority,
  isMultiSig,
  colonyAddress,
  motionDomainId,
  colonyRoles,
  colonyDomains,
  userAddress,
  domainId,
  batchKey,
  metaId,
}: {
  roles: Record<ColonyRole, boolean>;
  authority: Authority;
  isMultiSig: boolean;
  colonyAddress: string;
  motionDomainId: number;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  userAddress: string;
  domainId: number;
  batchKey: TRANSACTION_METHODS;
  metaId: string;
}) {
  const colonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const roleArray = Object.values(roles).reverse();
  roleArray.splice(2, 0, false);

  let roleBitmask = '';

  roleArray.forEach((role) => {
    roleBitmask += role ? '1' : '0';
  });

  const hexString = hexlify(parseInt(roleBitmask, 2));
  const zeroPadHexString = hexZeroPad(hexString, 32);

  let altTarget: string;

  switch (authority) {
    case Authority.ViaMultiSig: {
      const multiSigClient = yield colonyManager.getClient(
        ClientType.MultisigPermissionsClient,
        colonyAddress,
      );
      altTarget = multiSigClient.address;
      break;
    }
    case Authority.Own:
    default: {
      altTarget = isMultiSig ? colonyAddress : ADDRESS_ZERO;
      break;
    }
  }

  let initiatorAddress: string;

  if (isMultiSig) {
    initiatorAddress = yield colonyClient.signer.getAddress();
  } else {
    const votingReputationClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    initiatorAddress = votingReputationClient.address;
  }

  const requiredRoles =
    motionDomainId === Id.RootDomain
      ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
      : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;

  const [permissionDomainId, childSkillIndex] = yield call(
    getPermissionProofsLocal,
    {
      networkClient: colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      requiredDomainId: motionDomainId,
      requiredColonyRole: requiredRoles,
      permissionAddress: initiatorAddress,
      isMultiSig,
    },
  );

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

  if (isMultiSig) {
    return {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [Id.RootDomain, childSkillIndex, [altTarget], [encodedAction]],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    };
  }

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

  return {
    context: ClientType.VotingReputationClient,
    methodName: 'createMotion',
    identifier: colonyAddress,
    params: [
      motionDomainId,
      motionChildSkillIndex,
      altTarget,
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
  };
}

function* managePermissionsMotion({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    authority,
    colonyName,
    annotationMessage,
    customActionTitle,
    motionDomainId,
    colonyRoles,
    colonyDomains,
    // Is using the multi-sig decision method
    isMultiSig = false,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateSetUserRolesMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateSetUserRolesMotion',
      ]);

    const transactionParams = yield getCreateMotionParams({
      roles,
      authority,
      isMultiSig,
      colonyAddress,
      motionDomainId,
      colonyRoles,
      colonyDomains,
      userAddress,
      domainId,
      batchKey,
      metaId,
    });

    yield fork(createTransaction, createMotion.id, transactionParams);

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
