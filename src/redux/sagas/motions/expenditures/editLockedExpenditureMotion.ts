import {
  type AnyVotingReputationClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  getMulticallDataForUpdatedPayouts,
  uploadAnnotation,
  getResolvedPayouts,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';
import { takeFrom } from '~utils/saga/effects.ts';

export type EditExpenditureMotionPayload =
  Action<ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE>['payload'];

function* editLockedExpenditureMotion({
  payload: {
    colonyAddress,
    expenditure,
    payouts,
    networkInverseFee,
    annotationMessage,
    motionDomainId,
  },
  meta,
  meta: { setTxHash, id },
}: Action<ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE>) {
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchId = 'motion-edit-locked-expenditure';

  const resolvedPayouts = getResolvedPayouts(payouts, expenditure);

  const { createMotion, annotateEditLockedExpenditure } = yield call(
    createTransactionChannels,
    id,
    ['createMotion', 'annotateEditLockedExpenditure'],
  );

  try {
    const votingReputationClient: AnyVotingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
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

    const encodedMulticallData: string[] =
      yield getMulticallDataForUpdatedPayouts(
        expenditure,
        resolvedPayouts,
        colonyClient,
        networkInverseFee,
      );

    const encodedEditExpenditureAction =
      yield colonyClient.interface.encodeFunctionData(
        'multicall(bytes[] calldata)',
        [encodedMulticallData],
      );

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        encodedEditExpenditureAction,
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

    if (annotationMessage) {
      yield fork(createTransaction, annotateEditLockedExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchId,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });
    }

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    if (annotationMessage) {
      yield takeFrom(
        annotateEditLockedExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    setTxHash?.(txHash);

    const { type } = yield call(waitForTxResult, createMotion.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditLockedExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS>>({
        type: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS,
        meta,
      });

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(
        `Edit Expenditure Motion URL: ${APP_URL}${window.location.pathname.slice(
          1,
        )}?tx=${txHash}`,
      );
    }

    window.history.replaceState(
      {},
      '',
      `${APP_URL}${window.location.pathname.slice(1)}?tx=${txHash}`,
    );
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR>>({
      type: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR,
      payload: {
        name: ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* editLockedExpenditureMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE,
    editLockedExpenditureMotion,
  );
}
