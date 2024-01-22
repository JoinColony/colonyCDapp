import { put, takeEvery } from 'redux-saga/effects';

import { Action, AllActions, ActionTypes } from '~redux';

function* addVerifiedMembers({
  /*
  payload: {
    colonyAddress,
    colonyName,
    members,
    customActionTitle,
    annotationMessage,
  },
    */
  // meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_ADD_VERIFIED_MEMBERS>) {
  yield put<AllActions>({
    type: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_SUCCESS,
    payload: {},
    meta,
  });
}

export default function* addVerifiedMembersSaga() {
  yield takeEvery(ActionTypes.ACTION_ADD_VERIFIED_MEMBERS, addVerifiedMembers);
}
