import { call, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux';
import type { Action, AllActions } from '~redux';

import { getTxChannel } from '../transactions/index.ts';
import { putError } from '../utils/index.ts';

function* addVerifiedMembersMotion({
  payload: {
    colonyAddress,
    // colonyName,
    // domainId,
    members,
    // customActionTitle,
    //   annotationMessage,
  },
  meta: { id: metaId /* navigate, setTxHash */ },
  meta,
}: Action<ActionTypes.MOTION_ADD_VERIFIED_MEMBERS>) {
  let txChannel;

  try {
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for addVerifiedMembers transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for addVerifiedMembers transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_ADD_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    /*
    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
    */
  } catch (error) {
    return yield putError(
      ActionTypes.MOTION_ADD_VERIFIED_MEMBERS_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* addVerifiedMembersMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_ADD_VERIFIED_MEMBERS,
    addVerifiedMembersMotion,
  );
}
