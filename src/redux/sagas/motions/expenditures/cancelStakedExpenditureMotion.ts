import {
  ClientType,
  ColonyRole,
  Id,
  getChildIndex,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type Action, ActionTypes } from '~redux/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  createInvalidParamsError,
  getColonyManager,
  initiateTransaction,
  putError,
} from '~redux/sagas/utils/index.ts';

function* cancelStakedExpenditureMotion({
  meta,
  meta: { setTxHash },
  payload: {
    colonyAddress,
    stakedExpenditureAddress,
    shouldPunish,
    expenditure,
    motionDomainId,
  },
}: Action<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL>) {
  const sagaName = cancelStakedExpenditureMotion.name;

  if (
    !colonyAddress ||
    !expenditure ||
    !stakedExpenditureAddress ||
    !motionDomainId
  ) {
    const paramDescription =
      (!colonyAddress && 'Colony address') ||
      (!expenditure && 'The expenditure being funded') ||
      (!stakedExpenditureAddress && 'The address of the staked expenditure') ||
      (!motionDomainId && 'The id of the domain the motion is taking place in');
    throw createInvalidParamsError(sagaName, paramDescription as string);
  }

  const { createMotion /* annotationMessage */ } = yield call(
    createTransactionChannels,
    meta.id,
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
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stakedExpenditureAddress,
      );

    const [userPermissionDomainId, userChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
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
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      expenditure.nativeDomainId,
    );

    const batchKey = 'createMotion';

    yield createGroupTransaction({
      channel: createMotion,
      batchKey,
      meta,
      config: {
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
          key: batchKey,
          id: meta.id,
          index: 1,
        },
      },
    });

    yield initiateTransaction(createMotion.id);

    const {
      type,
      payload: { transactionHash: txHash },
    } = yield call(waitForTxResult, createMotion.channel);

    setTxHash?.(txHash);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS>>({
        type: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS,
        meta,
      });
    }
  } catch (e) {
    console.error(e);
    yield putError(ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR, e, meta);
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
