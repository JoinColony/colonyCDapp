import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { Action, AllActions } from '~redux/types/index.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
} from '../utils/index.ts';

function* releaseExpenditureStage({
  payload: {
    colonyAddress,
    expenditure,
    slotId,
    tokenAddresses,
    stagedExpenditureAddress,
  },
  meta,
}: Action<ActionTypes.RELEASE_EXPENDITURE_STAGE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      stagedExpenditureAddress,
    );

    yield fork(createTransaction, meta.id, {
      context: ClientType.StagedExpenditureClient,
      methodName: 'releaseStagedPayment',
      identifier: colonyAddress,
      params: [
        permissionDomainId,
        childSkillIndex,
        expenditure.nativeId,
        slotId,
        tokenAddresses,
      ],
    });

    yield initiateTransaction({ id: meta.id });
    yield waitForTxResult(txChannel);

    yield put<AllActions>({
      type: ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.RELEASE_EXPENDITURE_STAGE,
    releaseExpenditureStage,
  );
}
