import { type AnyColonyClient, ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { CoreActionGroup } from '~actions/index.ts';
import { getActionPermissions } from '~actions/utils.ts';
import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { ManageVerifiedMembersOperation } from '~types/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getChildIndexLocal,
  getColonyManager,
  getPermissionProofsLocal,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';
import {
  getAddVerifiedMembersOperation,
  getRemoveVerifiedMembersOperation,
} from '../utils/metadataDelta.ts';

function* manageVerifiedMembersMotion({
  payload: {
    operation,
    colonyAddress,
    colonyName,
    colonyRoles,
    colonyDomains,
    isMultiSig,
    members,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS>) {
  const txChannel = yield call(getTxChannel, metaId);
  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for manageVerifiedMember transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for manageVerifiedMember transaction');
    }
    const colonyManager = yield call(getColonyManager);
    const colonyClient: AnyColonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );

    const userAddress = yield colonyClient.signer.getAddress();

    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateManageVerifiedMembersMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateManageVerifiedMembersMotion',
      ]);

    const getVerifiedMembersOperation =
      operation === ManageVerifiedMembersOperation.Add
        ? getAddVerifiedMembersOperation
        : getRemoveVerifiedMembersOperation;

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'editColonyByDelta',
      [JSON.stringify(getVerifiedMembersOperation(members))],
    );

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      if (isMultiSig) {
        const [, childSkillIndex] = yield call(getPermissionProofsLocal, {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: Id.RootDomain,
          requiredColonyRoles: getActionPermissions(
            CoreActionGroup.ManageVerifiedMembers,
          ),
          permissionAddress: userAddress,
          isMultiSig: true,
        });

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: TRANSACTION_METHODS.CreateMotion,
          identifier: colonyAddress,
          params: [
            Id.RootDomain,
            childSkillIndex,
            [AddressZero],
            [encodedAction],
          ],
          group: {
            key: batchKey,
            id: metaId,
            index: 0,
          },
          ready: false,
        };
      }

      const rootDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(Id.RootDomain),
      );

      if (!rootDomain) {
        throw new Error('Cannot find rootDomain in colony domains');
      }

      const childSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: rootDomain.nativeId,
        parentDomainSkillId: rootDomain.nativeSkillId,
        domainNativeId: rootDomain.nativeId,
        domainSkillId: rootDomain.nativeSkillId,
      });
      const { skillId } = yield call(
        [colonyClient, colonyClient.getDomain],
        Id.RootDomain,
      );

      const { key, value, branchMask, siblings } = yield call(
        colonyClient.getReputation,
        skillId,
        AddressZero,
      );

      return {
        context: ClientType.VotingReputationClient,
        methodName: TRANSACTION_METHODS.CreateMotion,
        identifier: colonyAddress,
        params: [
          Id.RootDomain,
          childSkillIndex,
          AddressZero,
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

    const transactionParams = yield getCreateMotionParams();
    // create transactions
    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotateManageVerifiedMembersMotion.id, {
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
        annotateManageVerifiedMembersMotion.channel,
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
        txChannel: annotateManageVerifiedMembersMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageVerifiedMembersMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS,
    manageVerifiedMembersMotion,
  );
}
