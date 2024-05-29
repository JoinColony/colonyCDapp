import { all, call } from 'redux-saga/effects';

import cancelMultiSig from './cancelMultiSig.ts';
import createRootMultiSig from './createRootMultiSig.ts';
import setThresholds from './setThresholds.ts';
import voteOnMultiSigSaga from './voteOnMultiSig.ts';

export default function* multiSigSagas() {
  yield all([
    call(cancelMultiSig),
    call(createRootMultiSig),
    call(setThresholds),
    call(voteOnMultiSigSaga),
  ]);
}
