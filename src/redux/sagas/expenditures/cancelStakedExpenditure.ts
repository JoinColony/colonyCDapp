import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ColonyManager } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import { getColonyManager, initiateTransaction, putError } from '../utils';

function* cancelStakedExpenditure({
  meta,
  payload: {
    colonyAddress,
    stakedExpenditureAddress,
    shouldPunish,
    expenditure,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CANCEL>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, meta.id);

  try {
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

    yield fork(createTransaction, meta.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'cancelAndPunish',
      identifier: colonyAddress,
      params: [
        extensionPermissionDomainId,
        extensionChildSkillIndex,
        userPermissionDomainId,
        userChildSkillIndex,
        expenditure.nativeId,
        shouldPunish,
      ],
    });

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* cancelStakedExpenditureSaga() {
  yield takeEvery(
    ActionTypes.STAKED_EXPENDITURE_CANCEL,
    cancelStakedExpenditure,
  );
}
