import { call, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ColonyRole,
  Id,
  getChildIndex,
  getPermissionProofs,
} from '@colony/colony-js';

import { Action, ActionTypes } from '~redux';
import { createInvalidParamsError, getColonyManager } from '~redux/sagas/utils';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions';
import { ADDRESS_ZERO } from '~constants';

function* cancelStakedExpenditureMotion({
  meta,
  meta: { navigate },
  payload: {
    colonyAddress,
    colonyName,
    stakedExpenditureAddress,
    shouldPunish,
    expenditure,
    motionDomainId,
    fromDomainId,
  },
}: Action<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL>) {
  const sagaName = cancelStakedExpenditureMotion.name;

  if (
    !fromDomainId ||
    !colonyAddress ||
    !expenditure ||
    !stakedExpenditureAddress ||
    !motionDomainId
  ) {
    const paramDescription =
      (!fromDomainId && 'The domain id the expenditure is being funded from') ||
      (!colonyAddress && 'Colony address') ||
      (!expenditure && 'The expenditure being funded') ||
      (!stakedExpenditureAddress && 'The address of the staked expenditure') ||
      (!motionDomainId && 'The id of the domain the motion is taking place in');
    throw createInvalidParamsError(sagaName, paramDescription as string);
  }

  const batchId = 'motion-cancel-staked-expenditure';
  const { createMotion /* annotationMessage */ } = yield call(
    createTransactionChannels,
    batchId,
    ['createMotion', 'annotateMotion'],
  );

  try {
    const colonyManager = yield call(getColonyManager);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );
    const stakedExpenditureClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.StakedExpenditureClient,
      colonyAddress,
    );

    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stakedExpenditureAddress,
      );

    const [userPermissionDomainId, userChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
      );

    const actionParams = [
      extensionPermissionDomainId,
      extensionChildSkillIndex,
      userPermissionDomainId,
      userChildSkillIndex,
      expenditure.nativeId,
      shouldPunish,
    ];

    const encodedCancelAction =
      yield stakedExpenditureClient.interface.encodeFunctionData(
        'cancelAndPunish(uint256,uint256,uint256,uint256,uint256,bool)',
        actionParams,
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

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      motionDomainId,
      fromDomainId,
    );

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        stakedExpenditureClient.address,
        encodedCancelAction,
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
      yield put<Action<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS>>({
        type: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS,
        meta,
      });

      navigate(`/colony/${colonyName}/tx/${payload.transaction.hash}`);
    }
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR>>({
      type: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR,
      payload: {
        name: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* cancelStakedExpenditureMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL,
    cancelStakedExpenditureMotion,
  );
}
