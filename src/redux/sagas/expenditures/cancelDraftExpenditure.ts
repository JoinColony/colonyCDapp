import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

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

function* cancelDraftExpenditure({
  meta,
  payload: { colonyAddress, expenditure, stakedExpenditureAddress },
}: Action<ActionTypes.EXPENDITURE_DRAFT_CANCEL>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (expenditure.isStaked && stakedExpenditureAddress) {
      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stakedExpenditureAddress,
      );

      yield fork(createTransaction, meta.id, {
        context: ClientType.StakedExpenditureClient,
        methodName: 'cancelAndReclaimStake',
        identifier: colonyAddress,
        params: [permissionDomainId, childSkillIndex, expenditure.nativeId],
      });
      yield initiateTransaction({ id: meta.id });
    } else {
      yield fork(createTransaction, meta.id, {
        context: ClientType.ColonyClient,
        methodName: 'cancelExpenditure',
        identifier: colonyAddress,
        params: [expenditure.nativeId],
      });
      yield initiateTransaction({ id: meta.id });
    }
    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_DRAFT_CANCEL_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.EXPENDITURE_DRAFT_CANCEL_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* cancelDraftExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_DRAFT_CANCEL, cancelDraftExpenditure);
}
