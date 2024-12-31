import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants/index.ts';
import { type Action, ActionTypes } from '~redux/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
} from '~redux/sagas/utils/index.ts';
import { getExpenditureCreatingActionId } from '~utils/expenditures.ts';

function* cancelExpenditureMotion({
  meta,
  meta: { setTxHash },
  payload: { colony, votingReputationAddress, expenditure, motionDomainId },
}: Action<ActionTypes.MOTION_EXPENDITURE_CANCEL>) {
  const { createMotion } = yield call(createTransactionChannels, meta.id, [
    'createMotion',
  ]);

  try {
    if (
      !colony ||
      !expenditure ||
      !votingReputationAddress ||
      !motionDomainId
    ) {
      throw new Error('Invalid payload');
    }

    if (colony.version < 15) {
      throw new Error(
        'Motions to cancel expenditure are only available in Colony version 15 and above',
      );
    }

    const colonyManager = yield call(getColonyManager);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colony.colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      votingReputationAddress,
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

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'cancelExpenditureViaArbitration',
      [permissionDomainId, childSkillIndex, expenditure.nativeId],
    );

    const batchKey = 'createMotion';

    yield createGroupTransaction({
      channel: createMotion,
      batchKey,
      meta,
      config: {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
        identifier: colony.colonyAddress,
        params: [
          motionDomainId,
          childSkillIndex,
          ADDRESS_ZERO,
          encodedAction,
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
        associatedActionId: getExpenditureCreatingActionId(expenditure),
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
      yield put({
        type: ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS,
        meta,
      });

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(`Motion URL: ${APP_URL}${colony.name}?tx=${txHash}`);
    }
  } catch (e) {
    console.error(e);
    yield putError(ActionTypes.MOTION_EXPENDITURE_CANCEL_ERROR, e, meta);
  } finally {
    createMotion.channel.close();
  }
}

export default function* cancelExpenditureMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_EXPENDITURE_CANCEL,
    cancelExpenditureMotion,
  );
}
