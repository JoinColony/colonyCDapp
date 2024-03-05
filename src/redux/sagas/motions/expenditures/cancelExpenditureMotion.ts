import {
  type AnyColonyClient,
  ClientType,
  Id,
  getChildIndex,
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
  getDataForCancelExpenditureViaPermissions,
  initiateTransaction,
  putError,
  takeFrom,
} from '~redux/sagas/utils/index.ts';

function* cancelExpenditureMotion({
  meta,
  meta: { setTxHash },
  payload: {
    colonyAddress,
    votingReputationAddress,
    expenditure,
    motionDomainId,
  },
}: Action<ActionTypes.MOTION_EXPENDITURE_CANCEL>) {
  const batchId = 'motion-cancel-expenditure';
  const { createMotion } = yield call(createTransactionChannels, batchId, [
    'createMotion',
  ]);

  try {
    const sagaName = cancelExpenditureMotion.name;

    if (
      !colonyAddress ||
      !expenditure ||
      !votingReputationAddress ||
      !motionDomainId
    ) {
      const paramDescription =
        (!colonyAddress && 'Colony address') ||
        (!expenditure && 'The expenditure being cancelled') ||
        (!votingReputationAddress && 'The address of the staked expenditure') ||
        (!motionDomainId &&
          'The id of the domain the motion is taking place in');
      throw createInvalidParamsError(sagaName, paramDescription as string);
    }

    const colonyManager = yield call(getColonyManager);
    const colonyClient: AnyColonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );

    const params = yield getDataForCancelExpenditureViaPermissions(
      expenditure,
      colonyClient,
      votingReputationAddress,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'setExpenditureState',
      params,
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

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        votingReputationAddress,
        encodedAction,
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
      yield put<Action<ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS>>({
        type: ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS,
        meta,
      });
    }
  } catch (e) {
    console.error(e);
    yield putError(ActionTypes.MOTION_EXPENDITURE_CANCEL, e, meta);
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
