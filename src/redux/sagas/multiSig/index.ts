import { all, call } from 'redux-saga/effects';

import setGlobalThresholdSaga from './setGlobalThreshold.ts';

export default function* multiSigSagas() {
  yield all([call(setGlobalThresholdSaga)]);
}
