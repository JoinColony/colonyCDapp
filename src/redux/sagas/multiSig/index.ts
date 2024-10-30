import { all, call } from 'redux-saga/effects';

import cancelMultiSig from './cancelMultiSig.ts';
import fundExpenditureMultiSigSaga from './expenditures/fundExpenditureMultiSig.ts';
import finalizeMultiSigSaga from './finalizeMultiSig.ts';
import setThresholds from './setThresholds.ts';
import voteOnMultiSigSaga from './voteOnMultiSig.ts';

export default function* multiSigSagas() {
  yield all([
    call(cancelMultiSig),
    call(setThresholds),
    call(voteOnMultiSigSaga),
    call(finalizeMultiSigSaga),
    call(fundExpenditureMultiSigSaga),
  ]);
}
