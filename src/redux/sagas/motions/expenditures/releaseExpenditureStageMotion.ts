import {
  ClientType,
  ColonyRole,
  Id,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';
import { ADDRESS_ZERO } from '~constants';

import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../../transactions';
import { getColonyManager } from '../../utils';

function* releaseExpenditureStageMotion({
  payload: {
    colonyAddress,
    colonyName,
    expenditure,
    slotId,
    tokenAddresses,
    stagedExpenditureAddress,
    motionDomainId,
  },
  meta,
  meta: { navigate },
}: Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE>) {
  const batchId = 'motion-release-expenditure-stage';
  const { createMotion /* annotationMotionMessage */ } = yield call(
    createTransactionChannels,
    batchId,
    ['createMotion', 'annotationMotionMessage'],
  );
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    const stagedExpenditureClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.StagedExpenditureClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      stagedExpenditureAddress,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const encodedReleaseStagedPaymentAction =
      yield stagedExpenditureClient.interface.encodeFunctionData(
        'releaseStagedPayment(uint256,uint256,uint256,uint256,address[])',
        [
          permissionDomainId,
          childSkillIndex,
          expenditure.nativeId,
          slotId,
          tokenAddresses,
        ],
      );

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        encodedReleaseStagedPaymentAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        title: { id: 'transaction.group.createMotion.title' },
        description: {
          id: 'transaction.group.createMotion.description',
        },
      },
    });

    const { type, payload } = yield call(waitForTxResult, createMotion.channel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS>>({
        type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS,
        meta,
      });

      navigate(`/colony/${colonyName}/tx/${payload.transaction.hash}`);
    }
  } catch (error) {
    console.error(error);
    yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR>>({
      type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR,
      payload: {
        name: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR,
        message: JSON.stringify(error),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE,
    releaseExpenditureStageMotion,
  );
}
