import { all, call } from 'redux-saga/effects';

import createRootMultiSig from './createRootMultiSig.ts';
import setThresholds from './setThresholds.ts';
import voteOnMultiSigSaga from './voteOnMultiSig.ts';

export default function* multiSigSagas() {
  yield all([
    call(setThresholds),
    call(createRootMultiSig),
    call(voteOnMultiSigSaga),
  ]);
}
