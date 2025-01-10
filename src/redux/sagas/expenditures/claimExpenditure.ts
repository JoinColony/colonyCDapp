import { ClientType } from '@colony/colony-js';
import { takeEvery, put } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  claimExpenditurePayouts,
  getColonyManager,
  putError,
} from '../utils/index.ts';

export type ClaimExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CLAIM>['payload'];

export function* claimExpenditure({
  meta,
  payload: {
    associatedActionId,
    colonyAddress,
    nativeExpenditureId,
    claimablePayouts,
  },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    yield claimExpenditurePayouts({
      colonyAddress,
      claimablePayouts,
      metaId: meta.id,
      nativeExpenditureId,
      colonyClient,
      associatedActionId,
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CLAIM_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.EXPENDITURE_CLAIM_ERROR, error, meta);
  }
}

export default function* claimExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CLAIM, claimExpenditure);
}
