import { all, call } from 'redux-saga/effects';

import createExpenditureSaga from './createExpenditure';
import lockExpenditureSaga from './lockExpenditure';

export default function* expendituresSagas() {
  yield all([call(createExpenditureSaga), call(lockExpenditureSaga)]);
}
