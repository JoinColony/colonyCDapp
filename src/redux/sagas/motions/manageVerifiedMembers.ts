import {
  type AnyColonyClient,
  ClientType,
  getChildIndex,
  Id,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { ManageMembersType } from '~v5/common/ActionSidebar/partials/forms/ManageVerifiedMembersForm/consts.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
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
    manageMembers,
    colonyAddress,
    colonyName,
    domainId,
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

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      Id.RootDomain,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateManageVerifiedMembersMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateManageVerifiedMembersMotion',
      ]);

    const verifiedMembersOperation =
      manageMembers === ManageMembersType.Add
        ? getAddVerifiedMembersOperation
        : getRemoveVerifiedMembersOperation;

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'editColonyByDelta',
      [JSON.stringify(verifiedMembersOperation(members))],
    );

    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        domainId,
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
    });

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

    yield initiateTransaction({ id: createMotion.id });

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
