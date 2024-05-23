import { all, call } from 'redux-saga/effects';

import createRootMultiSig from './createRootMultiSig.ts';
import setThresholds from './setThresholds.ts';

export default function* multiSigSagas() {
  yield all([call(createRootMultiSig), call(setThresholds)]);
}
