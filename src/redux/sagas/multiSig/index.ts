import { all, call } from 'redux-saga/effects';

import createRootMultiSig from './createRootMultiSig.ts';
import setGlobalThresholdSaga from './setGlobalThreshold.ts';

export default function* multiSigSagas() {
  yield all([call(setGlobalThresholdSaga), call(createRootMultiSig)]);
}
