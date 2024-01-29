import { all, call } from 'redux-saga/effects';

import createDecisionSaga from './createDecision.ts';
import deleteDecisionSaga from './deleteDecision.ts';

export default function* decisionsSagas() {
  yield all([call(deleteDecisionSaga), call(createDecisionSaga)]);
}
