import {
  ClientType,
  ColonyRole,
  Id,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';
import { hexZeroPad, hexlify } from 'ethers/lib/utils';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';
import { ADDRESS_ZERO } from '~constants';
import { takeFrom } from '~utils/saga/effects';

import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../../transactions';
import { getColonyManager, initiateTransaction } from '../../utils';

const mask = [false, true];

const convertNumberToBytes32 = (number: number) =>
  hexZeroPad(hexlify(number), 32);

function* releaseExpenditureStageMotion({
  payload: { colonyAddress, expenditure, slotId, motionDomainId },
  meta,
  meta: { setTxHash, id },
}: Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE>) {
  const batchId = 'motion-release-expenditure-stage';
  const { createMotion /* annotationMotionMessage */ } = yield call(
    createTransactionChannels,
    id,
    ['createMotion', 'annotationMotionMessage'],
  );
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    const votingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      votingReputationClient.address,
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

    const keys = [convertNumberToBytes32(slotId), convertNumberToBytes32(1)];

    const encodedReleaseStagedPaymentAction =
      yield colonyClient.interface.encodeFunctionData(
        'setExpenditureState(uint256,uint256,uint256,uint256,bool[],bytes32[],bytes32)',
        [
          permissionDomainId,
          childSkillIndex,
          expenditure.nativeId,
          26, // @NOTE: Memory slot of expenditure's slots
          mask,
          keys,
          convertNumberToBytes32(0),
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

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    const { type } = yield call(waitForTxResult, createMotion.channel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS>>({
        type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS,
        meta,
      });
    }

    window.history.replaceState(
      {},
      '',
      `${window.location.origin}${window.location.pathname}?tx=${txHash}`,
    );
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
