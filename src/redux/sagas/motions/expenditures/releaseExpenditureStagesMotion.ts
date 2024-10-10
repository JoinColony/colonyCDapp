import {
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
  getChildIndex,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants';
import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';

export type ReleaseExpenditureStagesMotionPayload =
  Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES>['payload'];

function* releaseExpenditureStagesMotion({
  payload: {
    colonyAddress,
    stagedExpenditureAddress,
    votingReputationAddress,
    expenditure,
    slotIds,
    motionDomainId,
    tokenAddresses,
  },
  meta,
  meta: { setTxHash, id },
}: Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES>) {
  const { createMotion } = yield call(createTransactionChannels, id, [
    'createMotion',
    'annotateMotion',
  ]);
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    if (expenditure.status !== ExpenditureStatus.Finalized) {
      throw new Error(
        'Expenditure must be finalized in order to release expenditure stage',
      );
    }

    const stagedExpenditureClient = yield colonyManager.getClient(
      ClientType.StagedExpenditureClient,
      colonyAddress,
    );

    const [userPermissionDomainId, userChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        votingReputationAddress,
      );

    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
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

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      expenditure.nativeDomainId,
    );

    const multicallData = slotIds.map((slotId) =>
      stagedExpenditureClient.interface.encodeFunctionData(
        'releaseStagedPaymentViaArbitration',
        [
          userPermissionDomainId,
          userChildSkillIndex,
          extensionPermissionDomainId,
          extensionChildSkillIndex,
          expenditure.nativeId,
          slotId,
          tokenAddresses,
        ],
      ),
    );

    const encodedAction = stagedExpenditureClient.interface.encodeFunctionData(
      'multicall',
      [multicallData],
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
          stagedExpenditureAddress,
          encodedAction,
          key,
          value,
          branchMask,
          siblings,
        ],
      },
    });

    yield initiateTransaction(createMotion.id);

    const {
      type,
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield call(waitForTxResult, createMotion.channel);

    setTxHash?.(txHash);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS>>({
        type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS,
        meta,
      });
    }
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR>>({
      type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR,
      payload: {
        name: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* releaseExpenditureStagesSaga() {
  yield takeEvery(
    ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES,
    releaseExpenditureStagesMotion,
  );
}
