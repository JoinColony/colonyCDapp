import { all, call } from 'redux-saga/effects';

import setThresholds from './setThresholds.ts';

export default function* multiSigSagas() {
  yield all([call(setThresholds)]);
}
