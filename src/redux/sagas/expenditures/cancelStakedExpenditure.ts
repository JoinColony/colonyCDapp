import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager } from '~context';

import { createTransaction, getTxChannel } from '../transactions';
import { getColonyManager, putError } from '../utils';

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

    yield put<AllActions>({
      type: ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
      payload: {},
      meta,
    });
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
