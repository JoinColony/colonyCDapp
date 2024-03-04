import {
  type AnyVotingReputationClient,
  ClientType,
  ColonyRole,
  getChildIndex,
  getPermissionProofs,
} from '@colony/colony-js';
import { takeEvery, call, put, fork } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants';
import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes } from '~redux/index.ts';
import {
  createTransactionChannels,
  waitForTxResult,
  createTransaction,
} from '~redux/sagas/transactions/index.ts';
import {
  getColonyManager,
  takeFrom,
  getSetExpenditureValuesFunctionParams,
  initiateTransaction,
  saveExpenditureMetadata,
  uploadAnnotation,
} from '~redux/sagas/utils/index.ts';

function* createExpenditureMotion({
  payload: {
    colonyAddress,
    payouts,
    createdInDomain,
    fundFromDomainId,
    isStaged,
    stages,
    networkInverseFee,
    annotationMessage,
    motionDomainId,
  },
  meta: { setTxHash, id: metaId },
  meta,
}: Action<ActionTypes.MOTION_EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const batchKey = 'motion-create-expenditure';

  // Add slot id to each payout
  const payoutsWithSlotIds = payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));

  const { createMotion, annotateMotion } = yield call(
    createTransactionChannels,
    batchKey,
    ['createMotion', 'annotateMotion'],
  );

  try {
    const votingReputationClient: AnyVotingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      fundFromDomainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      fundFromDomainId,
      ColonyRole.Arbitration,
      votingReputationClient.address,
    );

    const encodedActions = [
      colonyClient.interface.encodeFunctionData('makeExpenditure', [
        permissionDomainId,
        childSkillIndex,
        createdInDomain.nativeId,
      ]),
      colonyClient.interface.encodeFunctionData(
        'setExpenditureValues',
        getSetExpenditureValuesFunctionParams(
          expenditureId,
          payoutsWithSlotIds,
          networkInverseFee,
        ),
      ),
      colonyClient.interface.encodeFunctionData('setExpenditureStaged', [
        expenditureId,
        true,
      ]),
    ];

    const encodedMulticallAction = colonyClient.interface.encodeFunctionData(
      'multicall(bytes[] calldata)',
      [encodedActions],
    );

    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        ADDRESS_ZERO,
        encodedMulticallAction,
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
      yield fork(createTransaction, annotateMotion.id, {
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
      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield waitForTxResult(createMotion.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    const { type } = yield call(waitForTxResult, createMotion.channel);

    yield saveExpenditureMetadata({
      colonyAddress,
      expenditureId,
      fundFromDomainId,
      stages: isStaged ? stages : undefined,
    });

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_EXPENDITURE_CREATE_SUCCESS>>({
        type: ActionTypes.MOTION_EXPENDITURE_CREATE_SUCCESS,
        meta,
      });
    }

    window.history.replaceState(
      {},
      '',
      `${APP_URL}${window.location.pathname}?tx=${txHash}`,
    );
  } catch (error) {
    console.error(error);
    yield put<Action<ActionTypes.MOTION_EXPENDITURE_CREATE_ERROR>>({
      type: ActionTypes.MOTION_EXPENDITURE_CREATE_ERROR,
      payload: {
        name: ActionTypes.MOTION_EXPENDITURE_CREATE_ERROR,
        message: JSON.stringify(error),
      },
      meta,
      error: true,
    });
  } finally {
    [createMotion, annotateMotion].forEach((transaction) =>
      transaction.channel.close(),
    );
  }
}

export default function* createExpenditureMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_EXPENDITURE_CREATE,
    createExpenditureMotion,
  );
}
