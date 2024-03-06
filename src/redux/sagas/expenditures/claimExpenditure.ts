import { takeEvery, put } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import { claimExpenditureSlots, putError } from '../utils/index.ts';

export type ClaimExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CLAIM>['payload'];

export function* claimExpenditure({
  meta,
  payload: {
    colonyAddress,
    nativeExpenditureId,
    claimableSlots,
    annotationMessage,
  },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  try {
    yield claimExpenditureSlots({
      colonyAddress,
      claimableSlots,
      metaId: meta.id,
      nativeExpenditureId,
      annotationMessage,
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
