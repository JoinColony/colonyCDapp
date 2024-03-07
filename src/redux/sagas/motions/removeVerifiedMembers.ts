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

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';
import { getRemoveVerifiedMembersOperation } from '../utils/metadataDelta.ts';

function* removeVerifiedMembersMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    members,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS>) {
  const txChannel = yield call(getTxChannel, metaId);
  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for addVerifiedMembers transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for removeVerifiedMembers transaction');
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

    const batchKey = 'createMotion';

    const { createMotion, annotateRemoveVerifiedMembersMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateRemoveVerifiedMembersMotion',
      ]);

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'editColonyByDelta',
      [JSON.stringify(getRemoveVerifiedMembersOperation(members))],
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
      yield fork(createTransaction, annotateRemoveVerifiedMembersMotion.id, {
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
        annotateRemoveVerifiedMembersMotion.channel,
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
        txChannel: annotateRemoveVerifiedMembersMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS_SUCCESS,
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
      ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* removeVerifiedMembersMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS,
    removeVerifiedMembersMotion,
  );
}
