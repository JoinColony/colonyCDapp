import { type AnyColonyClient, ClientType, Id } from '@colony/colony-js';
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
  getDataForCancelExpenditure,
  initiateTransaction,
  putError,
  takeFrom,
} from '~redux/sagas/utils/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';

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

    const colonyManager = yield call(getColonyManager);
    const colonyClient: AnyColonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colony.colonyAddress,
    );

    const params = yield getDataForCancelExpenditure(
      expenditure,
      colonyClient,
      votingReputationAddress,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'setExpenditureState',
      params,
    );

    // Child skill index is the second param of `setExpenditureState`
    const childSkillIndex = params[1];

    const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
    if (!rootDomain) {
      throw new Error('Root domain not found');
    }

    const skillId = rootDomain.nativeSkillId;

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const batchKey = 'createMotion';

    yield createGroupTransaction(createMotion, batchKey, meta, {
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

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(`Motion URL: ${APP_URL}${colony.name}?tx=${txHash}`);
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
