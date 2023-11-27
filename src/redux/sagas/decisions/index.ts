import { all, call } from 'redux-saga/effects';

import createDecisionSaga from './createDecision';
import deleteDecisionSaga from './deleteDecision';

export default function* decisionsSagas() {
  yield all([call(deleteDecisionSaga), call(createDecisionSaga)]);
}
